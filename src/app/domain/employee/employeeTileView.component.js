(function (module) {

  module.component('employeeTileView', {

    templateUrl: 'app/domain/employee/employeeTileView.html',
    controller: employeeTileViewController,
    controllerAs: 'vm'

  });

  function employeeTileViewController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee} = Schema.models();

    vm.use({});

    vm.rebindAll(Employee, {}, 'vm.employees');

    /*
     Functions
     */

  }

})(angular.module('webPage'));
