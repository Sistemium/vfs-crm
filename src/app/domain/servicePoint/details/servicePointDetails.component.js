(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/details/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });

  function servicePointDetailsController($scope, Schema, saControllerHelper, $state, Editing, PictureHelper, GalleryHelper, $document, $timeout) {

    const vm = saControllerHelper.setup(this, $scope)
      .use(GalleryHelper);

    const {ServicePoint, FilterSystem, Brand, Person, ServiceItem, ServicePointContact, Picture} = Schema.models();

    vm.use({

      isOpenEditPopover: {},
      tileBusy: {},
      progress: {},
      uploadingPicture: false,

      editItemClick,
      addItemClick,
      contactClick,
      addContractPerson,
      phoneTo,
      onChangeFile,
      pictureUpload,
      photoClick,
      testScroll,
      $onInit,

      editPhoto: Editing.editModal('edit-picture', 'Fotografijos Redagavimas'),
      editServicePointClick: Editing.editModal('edit-service-point', 'Aptarnavimo Taško Redagavimas'),
      editContractPerson: Editing.editModal('edit-service-point-contract', 'Redaguoti Naudotoją')

    });

    refresh();

    FilterSystem.findAll();
    Brand.findAll();
    Person.findAll();

    /*
     Functions
     */

    function $onInit() {
      let item = document.getElementsByClassName('more-photos');

      item[0].style.visibility = 'hidden';

      $timeout(500).then(() => item[0].style.visibility = 'visible');
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

    function phoneTo(ev, phone) {
      ev.stopPropagation();
      window.open('tel:' + phone, '_self');
    }

    function addItemClick() {
      vm.newItem = ServiceItem.createInstance({servicePointId: vm.servicePoint.id});
    }

    function addContractPerson() {
      Editing.editModal('edit-service-point-contract', 'Pridėti Naudotoją Prie Aptarnavimo Taško')(ServicePointContact.createInstance({servicePointId: vm.servicePoint.id}));
    }

    function contactClick() {
      vm.clicked = !vm.clicked;
    }

    function refresh() {

      let id = $state.params.servicePointId;

      vm.rebindOne(ServicePoint, id, 'vm.servicePoint');

      let busy = [
        ServicePoint.findAllWithRelations({id}, {bypassCache: true})(['ServiceItem', 'ServicePointContact', 'Picture'])
          .then(loadServicePointRelations)
      ];

      vm.setBusy(busy);
    }

    function loadServicePointRelations(data) {

      let servicePoint = _.first(data);

      if (!servicePoint) return;

      _.each(servicePoint.servingItems, serviceItem => {
        serviceItem.DSLoadRelations();
      });

      testScroll();

    }

    function editItemClick(item) {
      let popoverOpen = {};
      popoverOpen[item.id] = !vm.isOpenEditPopover[item.id];
      vm.isOpenEditPopover = popoverOpen;
    }

  }

})(angular.module('webPage'));
