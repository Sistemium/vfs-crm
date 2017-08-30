(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/details/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });

  function servicePointDetailsController($scope, Schema, saControllerHelper, $state, Editing, PictureHelper, GalleryHelper, NgMap, mapsHelper, GeoCoder, OnMap) {

    const vm = saControllerHelper.setup(this, $scope)
      .use(GalleryHelper);

    const {ServicePoint, FilterSystem, Brand, Person, ServiceItem, ServicePointContact, Picture} = Schema.models();

    vm.use({

      isOpenEditPopover: {},
      tileBusy: {},
      progress: {},
      uploadingPicture: false,

      addContactClick,
      addServiceItemClick,
      onChangeFile,
      pictureUpload,
      photoClick,
      $onInit,
      serviceContractClick,

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

    function $onInit() {

      vm.openMapClick = OnMap.open;

      // let item = document.getElementsByClassName('more-photos');
      // item[0].style.visibility = 'hidden';
      // $timeout(500).then(() => item[0].style.visibility = 'visible');
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
      Editing.editModal('edit-service-item', 'Naujas Įrenginys')(item);
    }

    function addContactClick() {
      let contact = ServicePointContact.createInstance({servicePointId: vm.servicePoint.id});
      Editing.editModal('edit-service-point-contact', 'Pridėti kontaktą prie aptarnavimo taško')(contact);
    }

    function refresh() {

      let id = $state.params.servicePointId;

      vm.rebindOne(ServicePoint, id, 'vm.servicePoint');

      let relations = ['ServiceItem', 'ServicePointContact', 'Picture', 'ServiceContract'];

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

    function loadGeoPosition() {

      mapsHelper.loadGoogleScript()
        .then(() => {
          vm.googleReady = true;

          GeoCoder.geocode({address: vm.servicePoint.address})
            .then(result => {
              vm.coords = result[0].geometry.location;
            });

          NgMap.getMap()
            .then(map => {
              vm.map = map;
            })
            .catch(err => {
              console.warn(err);
            })

        });

    }

  }

})(angular.module('webPage'));
