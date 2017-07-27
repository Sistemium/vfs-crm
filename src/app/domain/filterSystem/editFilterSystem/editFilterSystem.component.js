(function (module) {

  module.component('editFilterSystem', {

    bindings: {
      servicePoint: '=',
    },

    templateUrl: 'app/domain/filterSystem/editFilterSystem/editFilterSystem.html',
    controller: editFilterSystemController,
    controllerAs: 'vm'

  });

  function editFilterSystemController($scope, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({});

    console.log(vm.servicePoint);

    /*
     Functions
     */

  }

})(angular.module('webPage'));
