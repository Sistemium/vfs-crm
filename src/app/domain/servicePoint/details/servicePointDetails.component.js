(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/details/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });

  function servicePointDetailsController($scope, Schema, saControllerHelper, $state, Editing, PictureHelper, GalleryHelper, $document, NgMap, mapsHelper, GeoCoder, $uibModal, OnMap) {

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
      testScroll,
      $onInit,
      test,

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

    function test(servicePoint, coords) {

      let modalInstance = $uibModal.open({
        animation: true,
        template: `       
         
        <div class="modal-header" style="padding: 0 15px">
          <h3 style="margin-top: 10px">{{vm.servicePoint.address}}</h3>
        </div>
        
        <div class="modal-body" id="modal-body" resize resize-offset-top="190" resize-property="height">
          <ng-map
          ng-if="vm.isReady"
          style="height: 70%"
          center='[{{vm.coords.lat()}}, {{vm.coords.lng()}}]'
          zoom="13"
          >
            <marker 
              position="{{vm.coords.lat()}}, {{vm.coords.lng()}}"
              animation="DROP"
              draggable="true">      
            </marker>
          </ng-map>   
        </div>`,

        size: 'lg',

        controller

      });

      modalInstance.result
        .then(() => {
        }, () => {
        });

      function controller($scope) {

        const vm = {};

        modalInstance.rendered
          .then(() => {
            vm.isReady = true;
          });

        $scope.vm = vm;

        vm.servicePoint = servicePoint;
        vm.coords = coords;

      }
    }

    function $onInit() {

      vm.openMap = OnMap.open();

      // let item = document.getElementsByClassName('more-photos');
      //
      // item[0].style.visibility = 'hidden';
      //
      // $timeout(500).then(() => item[0].style.visibility = 'visible');
    }

    function testScroll() {

      let scrollingElem = document.getElementsByClassName('service-point-picture');

      $document.ready(function () {
        let elem = document.getElementsByClassName('picture-gallery');

        if (elem[0].childNodes[1].scrollHeight > elem[0].childNodes[1].clientHeight) {
          vm.scrollToGallery = true;
        }

        angular.element(scrollingElem).on('scroll', debounceFunc);

      });

      let debounceFunc = _.debounce(function ($event) {

        if ($event.srcElement.scrollTop > 210) {
          vm.scrollToGallery = false;
        } else {
          vm.scrollToGallery = true;
        }

      }, 100);

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
