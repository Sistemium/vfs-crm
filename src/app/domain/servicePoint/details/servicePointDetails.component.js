(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/details/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });

  function servicePointDetailsController($scope, Schema, saControllerHelper, $state, Editing,
                                         $timeout, PictureHelper, GalleryHelper, NgMap, mapsHelper,
                                         GeoCoder, ServicePointMapModal, $q) {

    const vm = saControllerHelper.setup(this, $scope)
      .use(GalleryHelper);

    const {
      ServicePoint, FilterSystem, Brand, Person, ServiceItem, ServicePointContact, Picture, Location
    } = Schema.models();

    const defaultCoords = {lng: 23.897, lat: 55.322};

    vm.use({

      isOpenEditPopover: {},
      tileBusy: {},
      progress: {},
      coords: {},

      divided: [],
      confirmDestroy: [],

      uploadingPicture: false,
      noGeoPosition: true,

      addContactClick,
      addServiceItemClick,
      onChangeFile,
      pictureUpload,
      photoClick,
      serviceContractClick,
      mapClick,
      personNameClick,
      deleteServicePointContactClick,

      editPhoto: Editing.editModal('edit-picture', 'Fotografijos Redagavimas'),
      editServicePointClick: Editing.editModal('edit-service-point', 'Aptarnavimo Taško Redagavimas'),
      contactClick: Editing.editModal('edit-service-point-contact', 'Redaguoti Kontaktą'),
      editServiceItemClick

    });

    refresh();

    FilterSystem.findAll();
    Brand.findAll();
    Person.findAll();

    $scope.$watch('vm.servicePoint.location.ts', (nv, ov) => {

      if (nv !== ov) {
        vm.coords.lat = vm.servicePoint.location.latitude;
        vm.coords.lng = vm.servicePoint.location.longitude;
      }

    });

    $scope.$on('onLocationChange', () => {

      if (vm.noGeoPosition) {
        vm.noGeoPosition = false;
      }

    });

    /*
     Functions
     */

    function editServiceItemClick(item) {

      Editing.editModal('show-service-item', `«${vm.servicePoint.address}» irenginys`)(item)
        .then(() => {
          vm.servicePoint.refreshCache();
          return item && item.DSRefresh();
        })
        .catch(_.noop);

    }

    function deleteServicePointContactClick(item) {

      let itemId = item.person.id;

      vm.confirmDestroy[itemId] = !vm.confirmDestroy[itemId];

      if (vm.confirmDestroy[itemId]) {
        return $timeout(2000)
          .then(() => delete vm.confirmDestroy[itemId]);
      }

      ServicePointContact.destroy(item.servicePointContact);

    }

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
        _.assign(mapModelConfig, {
          coords: {
            lng: defaultCoords.lng,
            lat: defaultCoords.lat
          }
        }, {zoom: 7}, {noGeo: vm.noGeoPosition});
      }

      let instance = ServicePointMapModal.open(mapModelConfig, vm.noGeoPosition);

      instance.result.then(_.noop, _.noop);

    }

    function serviceContractClick() {
      Editing.editModal('edit-service-contract', 'Sutarties Redagavimas')(vm.servicePoint.currentServiceContract);
    }

    function personNameClick(ev, item) {

      ev.stopPropagation();

      let component = `edit-${_.kebabCase(item.constructor.name)}`;
      let model = Schema.model(item.constructor.name);
      let title = `${model.meta.label.genitive} Redagavimas`;

      Editing.editModal(component, title)(item);

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
      vm.tileBusy = {promise: busy, message: 'Nuotraukos parsisiuntimas'};

    }

    function addServiceItemClick() {
      let item = ServiceItem.createInstance({servicePointId: vm.servicePoint.id});
      Editing.editModal('edit-service-item', 'Naujas Įrenginys')(item)
        .then(() => {
          _.result(item, 'servicePoint.refreshCache');
          return item.DSRefresh();
        })
        .catch(_.noop);
    }

    function addContactClick() {
      let contact = ServicePointContact.createInstance({servicePointId: vm.servicePoint.id});
      Editing.editModal('edit-service-point-contact', 'Pridėti kontaktą prie aptarnavimo taško')(contact);
    }

    function refresh() {

      let id = $state.params.servicePointId;

      vm.rebindOne(ServicePoint, id, 'vm.servicePoint');

      let relations = ['ServiceItem', 'ServicePointContact', 'Picture', 'ServiceContract', 'Location', 'Locality'];

      let busy = [
        ServicePoint.findAllWithRelations({id}, {bypassCache: true})(relations)
          .then(res => {

            let servicePoint = _.first(res);

            $q.all([
              loadServicePointRelations(servicePoint),
              loadLocalityRelation(servicePoint)
            ])
              .then(() => {

                loadGoogleScript();
                vm.rebindAll(ServicePointContact, {servicePointId: id}, 'vm.servicePointContacts', onServicePointContact);

              });

          })
      ];

      vm.setBusy(busy);
    }

    function onServicePointContact() {

      let contractPerson = _.get(vm.servicePoint, 'currentServiceContract.customerPerson');

      vm.contactPersons = _.map(vm.servicePointContacts, c => {
        return {person: c.person, servicePointContact: c};
      });

      if (contractPerson) {
        vm.contactPersons.push({person: contractPerson});
      }

      let contractLegalentity = _.get(vm.servicePoint, 'currentServiceContract.customerLegalEntity');

      if (contractLegalentity) {
        vm.contactPersons.push({person: contractLegalentity});
      }

    }

    function loadServicePointRelations(servicePoint) {

      if (!_.get(servicePoint, 'currentServiceContract')) {
        _.result(servicePoint, 'currentServiceContract.DSLoadRelations');
      }

      if (_.get(servicePoint, 'servingItems')) {

        return $q.all(_.map(servicePoint.servingItems, serviceItem => {
          return serviceItem.DSLoadRelations(['ServiceContract', 'ServiceContractItem', 'currentServiceContract']);
        }));

      }

      return $q.resolve();

    }

    function noCoords() {
      vm.coords.lat = defaultCoords.lat;
      vm.coords.lng = defaultCoords.lng;
    }

    function loadLocalityRelation(servicePoint) {

      let locality = _.get(servicePoint, 'locality');

      if (!locality) {
        return $q.resolve();
      }

      return locality.DSLoadRelations('District');

    }

    function positionMarker() {

      console.warn('Searching address', vm.divided.join(' '));

      vm.coordsSearch = true;

      GeoCoder.geocode({'address': vm.divided.join(' ')})
        .then(result => {

          let locationData = {
            longitude: result[0].geometry.location.lng(),
            latitude: result[0].geometry.location.lat(),
            altitude: 0,
            source: 'GeoCoder',
            ownerXid: vm.servicePoint.id,
            timestamp: new Date()
          };

          Location.create(locationData)
            .then(savedLocation => {

              vm.servicePoint.locationId = savedLocation.id;
              vm.servicePoint.DSCreate();
              assignCoords();
              loadMap();
              vm.noGeoPosition = false;

            })
            .catch((err) => {
              console.error(err, 'while saving location');
              noCoords();
            })
            .finally(() => {
              vm.coordsSearch = false;
            })

        })
        .catch(() => {

          if (vm.divided.length > 1) {
            vm.divided.pop();
            positionMarker();
          } else {
            vm.coordsSearch = false;
          }

        })

    }

    function loadGoogleScript() {

      mapsHelper.loadGoogleScript()
        .then(() => {
          vm.googleReady = true;
          loadGeoPosition();
        });

    }

    function assignCoords() {
      _.assign(vm.coords, {lat: vm.servicePoint.location.latitude});
      _.assign(vm.coords, {lng: vm.servicePoint.location.longitude});
    }

    function loadGeoPosition() {

      if (!vm.servicePoint) {
        return;
      }

      if (_.get(vm.servicePoint, 'location')) {

        assignCoords();
        loadMap();
        vm.noGeoPosition = false;

      } else {

        let {address} = vm.servicePoint;

        if (!address) {
          return;
        }

        let {locality} = vm.servicePoint;

        let district = _.get(locality, 'district.name');

        address = district + ', ' + address;

        vm.divided = address.split(', ');

        if (vm.divided.length === 3) {

          let streetAndHouseNumber = _.last(vm.divided);

          let streetAndHouseSeparated = streetAndHouseNumber.split(/ (?=[^ ]*$)/);

          vm.divided.pop();
          vm.divided.push(...streetAndHouseSeparated);
        }

        positionMarker();
        noCoords();

      }

    }

    function loadMap() {

      NgMap.getMap('smallMap')
        .then(map => {
          vm.map = map;
        })
    }

  }

})(angular.module('webPage'));
