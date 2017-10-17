(function (module) {

  module.component('editLegalEntity', {

    bindings: {
      legalEntity: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/legalEntity/editLegalEntity/editLegalEntity.html',
    controller: editLegalEntityController,
    controllerAs: 'vm'

  });

  function editLegalEntityController() {

  }

})(angular.module('webPage'));
