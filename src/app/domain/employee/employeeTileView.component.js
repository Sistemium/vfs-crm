(function (module) {

  module.component('employeeTileView', {

    bindings: {
      employees: '='
    },

    templateUrl: 'app/domain/employee/employeeTileView.html',
    controller: employeeTileViewController,
    controllerAs: 'vm'

  });

  function employeeTileViewController($scope, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({});

    /*
     Functions
     */

  }

})(angular.module('webPage'));
