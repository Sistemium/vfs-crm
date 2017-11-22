(function (module) {

  module.component('editFilterSystemType', {

    bindings: {
      filterSystemType: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/filterSystemType/editFilterSystemType/editFilterSystemType.html',
    controller: editFilterSystemTypeController,
    controllerAs: 'vm'

  });

  function editFilterSystemTypeController(ReadyStateHelper, $scope) {
    ReadyStateHelper.setupController(this, $scope, 'filterSystemType');
  }

})(angular.module('webPage'));
