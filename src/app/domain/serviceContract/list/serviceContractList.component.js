(function (module) {

  module.component('serviceContractList', {

    bindings: {
      serviceContracts: '=',
      serviceContractClickFn: '='
    },

    templateUrl: 'app/domain/serviceContract/list/serviceContractList.html',
    controller: serviceContractListController,
    controllerAs: 'vm'

  });

  function serviceContractListController(saControllerHelper, $scope, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      serviceContractClick
    });

    /*
    Functions
     */

    function serviceContractClick(serviceContract) {
      Editing.editModal('edit-service-contract', 'Sutarties Redagavimas')(serviceContract);
    }

  }

})(angular.module('webPage'));
