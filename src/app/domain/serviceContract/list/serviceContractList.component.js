(function (module) {

  module.component('serviceContractList', {

    bindings: {
      serviceContracts: '=',
      serviceContractClickFn: '='
    },

    templateUrl: 'app/domain/serviceContract/list/serviceContractList.html',
    controllerAs: 'vm'

  });

})(angular.module('webPage'));
