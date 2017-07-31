(function (module) {

  module.component('employeeTiles', {

    bindings: {
      employees: '='
    },

    templateUrl: 'app/domain/employee/tiles/employeeTiles.html',
    controller: employeeTilesController,
    controllerAs: 'vm'

  });

  function employeeTilesController($scope, saControllerHelper, Editing, PictureHelper, Schema, GalleryHelper) {

    const vm = saControllerHelper.setup(this, $scope)
      .use(GalleryHelper);

    const {Picture} = Schema.models();

    vm.use({
      tileBusy: {},
      editItem,
      isOpenedEditPopover: [],
      editItemClick: Editing.editModal('edit-employee', 'Darbuotojo redagavimas'),
      pictureSelect,
      avatarPhotoClick
    });

    /*
     Functions
     */

    function avatarPhotoClick(photo) {

      $scope.imagesAll = Picture.getAll();

      vm.thumbnailClick(photo);

    }

    function editItem(item) {
      vm.currItem = item.id;
    }

    function pictureSelect(employee, file) {

      let helper = new PictureHelper();
      let {person} = employee;
      let ownerXid = _.get(person, 'id');

      if (!ownerXid) {
        console.error('no personId for employee', employee);
        return;
      }

      let busy = helper.onSelect(file, Picture.createInstance({ownerXid}), 'Person')
        .then(picture => {
          person.avatarPictureId = picture.id;
          return person.DSCreate();
        })
        .catch(err => console.error(err));

      vm.tileBusy[employee.id] = {promise: busy, message: 'Nuotraukos siuntimas'};

    }

  }

})(angular.module('webPage'));
