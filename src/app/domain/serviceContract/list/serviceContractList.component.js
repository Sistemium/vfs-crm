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
      preOpen,
      openModal: Editing.editModal('edit-service-contract', 'Sutarties Redagavimas')
    });

    /*
    Functions
     */

    function preOpen(res) {

      vm.serviceContract = {};
      vm.serviceContract.type = res.legalType;
      vm.openModal(res);
    }

  }

})(angular.module('webPage'));
