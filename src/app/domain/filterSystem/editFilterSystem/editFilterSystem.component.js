(function (module) {

  module.component('editFilterSystem', {

    bindings: {
      filterSystem: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/filterSystem/editFilterSystem/editFilterSystem.html',
    controller: editFilterSystemController,
    controllerAs: 'vm'

  });

  function editFilterSystemController($scope, ReadyStateHelper) {

    ReadyStateHelper.setupController(this, $scope, 'filterSystem');

  }

})(angular.module('webPage'));
