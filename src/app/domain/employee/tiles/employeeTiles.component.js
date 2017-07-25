(function (module) {

  module.component('employeeTiles', {

    bindings: {
      employees: '='
    },

    templateUrl: 'app/domain/employee/tiles/employeeTiles.html',
    controller: employeeTilesController,
    controllerAs: 'vm'

  });

  function employeeTilesController($scope, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      editItem,
      isOpenedEditPopover: [],
      currentItem: null
    });

    /*
     Functions
     */

    function editItem(item) {
      vm.currItem = item.id;
    }

  }

})(angular.module('webPage'));
