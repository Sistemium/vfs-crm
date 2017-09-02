(function (module) {

  module.component('editServiceContract', {

    bindings: {
      serviceContract: '='
    },

    templateUrl: 'app/domain/serviceContract/editServiceContract/editServiceContract.html',
    controller: editServiceContract,
    controllerAs: 'vm'

  });

  function editServiceContract($scope, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit
    });

    /*
     Functions
     */

    function $onInit() {
      if (vm.serviceContract.siteId) {
        vm.hideSite = true;
      }
    }

  }

})(angular.module('webPage'));
