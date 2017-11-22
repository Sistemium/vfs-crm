(function (module) {

  module.component('editEmployee', {

    bindings: {
      employee: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/employee/editEmployee/editEmployee.html',
    controller: editEmployeeController,
    controllerAs: 'vm'

  });

  function editEmployeeController(ReadyStateHelper, $scope) {
    ReadyStateHelper.setupController(this, $scope, 'employee');
  }

})(angular.module('webPage'));
