(function (module) {

  module.component('employeeTable', {

    bindings: {
      employees: '='
    },

    templateUrl: 'app/domain/employee/table/employeeTable.html',
    controller: employeeTableController,
    controllerAs: 'vm'

  });

  function employeeTableController($scope, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({});

    /*
     Functions
     */

  }

})(angular.module('webPage'));
