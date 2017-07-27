(function (module) {

  module.component('editFilterSystem', {

    bindings: {
      filterSystem: '='
    },

    templateUrl: 'app/domain/filterSystem/editFilterSystem/editFilterSystem.html',
    controller: editFilterSystemController,
    controllerAs: 'vm'

  });

  function editFilterSystemController($scope, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({});

    /*
     Functions
     */

  }

})(angular.module('webPage'));
