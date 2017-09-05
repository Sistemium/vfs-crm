(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/details/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });

  function servicePointDetailsController($scope, Schema, saControllerHelper, $state, Editing, $timeout,
                                         PictureHelper, GalleryHelper, NgMap, mapsHelper, GeoCoder, ServicePointMapModal) {

    const vm = saControllerHelper.setup(this, $scope)
      .use(GalleryHelper);

    const {ServicePoint, FilterSystem, Brand, Person, ServiceItem, ServicePointContact, Picture, Location} = Schema.models();

    vm.use({

      isOpenEditPopover: {},
      tileBusy: {},
      progress: {},
      uploadingPicture: false,
      coords: {},

      addContactClick,
      addServiceItemClick,
      onChangeFile,
      pictureUpload,
      photoClick,
      $onInit,
      serviceContractClick,
      mapClick,

      editPhoto: Editing.editModal('edit-picture', 'Fotografijos Redagavimas'),
      editServicePointClick: Editing.editModal('edit-service-point', 'Aptarnavimo Taško Redagavimas'),
      servicePointContactClick: Editing.editModal('edit-service-point-contact', 'Redaguoti Kontaktą'),
      editServiceItemClick: Editing.editModal('edit-service-item', 'Redaguoti Įrenginį')

    });

    refresh();

    FilterSystem.findAll();
    Brand.findAll();
    Person.findAll();

    /*
     Functions
     */

    function mapClick() {

      let mapModelConfig = {
        servicePoint: vm.servicePoint
      };

      if (vm.servicePoint.location) {
        _.assign(mapModelConfig, {
          coords: {
            lng: vm.servicePoint.location.longitude,
            lat: vm.servicePoint.location.latitude
          }
        })
      } else {
        _.assign(mapModelConfig, {coords: {lng: 23.897, lat: 55.322}}, {zoom: 7}, {noGeo: vm.noGeoPosition});
      }

      let instance = ServicePointMapModal.open(mapModelConfig);

      instance.result.then(_.noop, _.noop);

    }

    function $onInit() {
      vm.watchScope('vm.servicePoint.address', address => {
        if (!address || !vm.googleReady) return;
        positionMarker();
      });

    }

    function serviceContractClick() {
      Editing.editModal('edit-service-contract', 'Sutarties Redagavimas')(vm.servicePoint.currentServiceContract);
    }

    function onChangeFile(item) {

      if (item) {
        vm.uploadingPicture = true;
        vm.pictureUpload(item);
      }

    }

    function photoClick(photo) {

      $scope.imagesAll = vm.servicePoint.pictures;
      vm.thumbnailClick(photo);

    }

    function pictureUpload(item) {

      if (!item) return;

      let helper = new PictureHelper();

      let picture = Picture.createInstance({
        ownerXid: vm.servicePoint.id,
        target: 'ServicePoint'
      });

      let busy = helper.onSelect(item, picture)
        .then(() => {
          vm.servicePoint.DSCreate().then(() => {
            vm.tileBusy = {};
            vm.progress = {};
            vm.uploadingPicture = false;
          })
        })
        .catch(err => {
          console.error(err);
        });

      vm.progress = helper;
      vm.tileBusy = {promise: busy, message: 'Nuotraukos siuntimas'};

    }

    function addServiceItemClick() {
      let item = ServiceItem.createInstance({servicePointId: vm.servicePoint.id});
      Editing.editModal('edit-service-item', 'Naujas Įrenginys')(item)
        .then((serviceItem) => _.result(serviceItem, 'servicePoint.refreshCache'));
    }

    function addContactClick() {
      let contact = ServicePointContact.createInstance({servicePointId: vm.servicePoint.id});
      Editing.editModal('edit-service-point-contact', 'Pridėti kontaktą prie aptarnavimo taško')(contact);
    }

    function refresh() {

      let id = $state.params.servicePointId;

      vm.rebindOne(ServicePoint, id, 'vm.servicePoint');

      let relations = ['ServiceItem', 'ServicePointContact', 'Picture', 'ServiceContract', 'Location'];

      let busy = [
        ServicePoint.findAllWithRelations({id}, {bypassCache: true})(relations)
          .then(_.first)
          .then(loadServicePointRelations)
          .then(loadGeoPosition)
      ];

      vm.setBusy(busy);
    }

    function loadServicePointRelations(servicePoint) {

      _.result(servicePoint, 'currentServiceContract.DSLoadRelations');

      _.each(servicePoint.servingItems, serviceItem => {
        serviceItem.DSLoadRelations();
      });

    }

    function positionMarker() {

      if (vm.servicePoint.location) {
        return $timeout();
      }

      return GeoCoder.geocode({address: vm.servicePoint.address})
        .then(result => {

          let locationData = {
            longitude: result[0].geometry.location.lng(),
            latitude: result[0].geometry.location.lat(),
            altitude: 0,
            source: 'geoCoder',
            ownerXid: vm.servicePoint.id,
            timestamp: new Date()
          };

          Location.create(locationData)
            .then(savedLocation => {

              vm.servicePoint.locationId = savedLocation.id;
              vm.servicePoint.DSCreate();

            });

        });

    }

    function loadGeoPosition() {

      if (vm.servicePoint.location) {
        _.assign(vm.coords, {lat: vm.servicePoint.location.latitude});
        _.assign(vm.coords, {lng: vm.servicePoint.location.longitude});
      } else {
        vm.coords.lat = 55.322;
        vm.coords.lng = 23.897;
        vm.noGeoPosition = true;
      }

      mapsHelper.loadGoogleScript()
        .then(() => {

          vm.googleReady = true;

          positionMarker()
            .then(() => {
              return NgMap.getMap('smallMap')
                .then(map => vm.map = map)
            })
            .catch(() => {
              console.error('No geoposition was found by the address: ' + vm.servicePoint.address);
            });

        });

    }

  }

})(angular.module('webPage'));
