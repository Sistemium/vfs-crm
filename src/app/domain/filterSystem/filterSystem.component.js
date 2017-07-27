(function (module) {

  module.component('filterSystem', {

    templateUrl: 'app/domain/filterSystem/filterSystem.html',
    controller: filterSystemController,
    controllerAs: 'vm'

  });

  function filterSystemController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    //const {} = Schema.models();

    vm.use({});

    /*
     Functions
     */

  }

})(angular.module('webPage'));
