(function (module) {

  module.component('editEmployee', {

    bindings: {
      employee: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/employee/editEmployee/editEmployee.html',
    controllerAs: 'vm'

  });

})(angular.module('webPage'));
