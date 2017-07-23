(function (module) {

  module.component('employeeTableView', {

    templateUrl: 'app/domain/employee/employeeTableView.html',
    controller: employeeTableViewController,
    controllerAs: 'vm'

  });

  function employeeTableViewController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee} = Schema.models();

    vm.use({});

    vm.rebindAll(Employee, {}, 'vm.employees');

    /*
     Functions
     */

  }

})(angular.module('webPage'));
