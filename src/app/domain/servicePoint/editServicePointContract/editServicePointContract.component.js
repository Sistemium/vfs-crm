(function (module) {

  module.component('editServicePointContract', {

    bindings: {
      servicePointContract: '='
    },

    templateUrl: 'app/domain/servicePoint/editServicePointContract/editServicePointContract.html',
    controllerAs: 'vm',
    controller: editContractPersonController

  });

  function editContractPersonController() {
  }

})(angular.module('webPage'));
