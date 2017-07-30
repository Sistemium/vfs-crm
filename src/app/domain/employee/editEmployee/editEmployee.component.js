(function (module) {

  module.component('editEmployee', {

    bindings: {
      employee: '='
    },

    templateUrl: 'app/domain/employee/editEmployee/editEmployee.html',
    controllerAs: 'vm'

  });


})(angular.module('webPage'));
