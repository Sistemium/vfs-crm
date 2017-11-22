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

  function editLegalEntityController(ReadyStateHelper, $scope) {
    ReadyStateHelper.setupController(this, $scope, 'legalEntity');
  }

})(angular.module('webPage'));
