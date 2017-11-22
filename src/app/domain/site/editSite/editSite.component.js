(function (module) {

  module.component('editSite', {

    bindings: {
      site: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/site/editSite/editSite.html',
    controller: editFilterSystemTypeController,
    controllerAs: 'vm'

  });

  function editFilterSystemTypeController(ReadyStateHelper, $scope) {
    ReadyStateHelper.setupController(this, $scope, 'site');
  }

})(angular.module('webPage'));
