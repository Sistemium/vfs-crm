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
      progress: {},
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

      let personIds = _.map(vm.employees, 'personId');

      $scope.imagesAll = _.filter(Picture.getAll(), picture => personIds.indexOf(picture.ownerXid) >= 0);

      vm.thumbnailClick(photo);

    }

    function editItem(item) {
      vm.currItem = item.id;
    }

    function pictureSelect(employee, file) {

      let helper = new PictureHelper();
      let {person} = employee;

      if (!person) {
        console.error('no person for employee', employee);
        return;
      }

      let picture = Picture.createInstance({
        ownerXid: person.id,
        target: 'Person'
      });

      let busy = helper.onSelect(file, picture)
        .then(picture => {
          person.avatarPictureId = picture.id;
          return person.DSCreate();
        })
        .catch(err => console.error(err));

      vm.progress[employee.id] = helper;
      vm.tileBusy[employee.id] = {promise: busy, message: 'Nuotraukos siuntimas'};

    }

  }

})(angular.module('webPage'));
