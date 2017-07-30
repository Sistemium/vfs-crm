(function (module) {

  module.component('employeeTiles', {

    bindings: {
      employees: '='
    },

    templateUrl: 'app/domain/employee/tiles/employeeTiles.html',
    controller: employeeTilesController,
    controllerAs: 'vm'

  });

  function employeeTilesController($scope, saControllerHelper, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      editItem,
      isOpenedEditPopover: [],
      editItemClick: Editing.editModal('edit-employee', 'Darbuotojo redagavimas'),
      pictureSelect
    });

    /*
     Functions
     */

    function editItem(item) {
      vm.currItem = item.id;
    }

    function pictureSelect(file) {
      console.warn(file);
    }

  }

})(angular.module('webPage'));
