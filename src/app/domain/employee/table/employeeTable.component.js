(function (module) {

  module.component('employeeTable', {

    bindings: {
      employees: '='
    },

    templateUrl: 'app/domain/employee/table/employeeTable.html',
    controller: employeeTableController,
    controllerAs: 'vm'

  });

  function employeeTableController($scope, saControllerHelper, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      employeeClick: Editing.editModal('edit-employee', 'Darbuotojo redagavimas')
    });

    /*
     Functions
     */

  }

})(angular.module('webPage'));
