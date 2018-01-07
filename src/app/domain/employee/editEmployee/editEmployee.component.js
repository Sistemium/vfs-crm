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

  function editEmployeeController(ReadyStateHelper, $scope, Schema) {

    const vm = ReadyStateHelper.setupController(this, $scope, 'employee')
      .use({
        $onInit
      });

    const {Site} = Schema.models();

    function $onInit() {
      if (vm.employee && !vm.employee.id) {
        vm.employee.siteId = _.get(Site.meta.getCurrent(), 'id');
      }
    }

  }

})(angular.module('webPage'));
