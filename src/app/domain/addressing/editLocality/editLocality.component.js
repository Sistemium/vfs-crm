(function (module) {

  module.component('editLocality', {

    bindings: {
      locality: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/addressing/editLocality/editLocality.html',
    controllerAs: 'vm',
    controller: editLocalityController

  });

  function editLocalityController($scope, ReadyStateHelper) {
    ReadyStateHelper.setupController(this, $scope, 'locality');
  }

})(angular.module('webPage'));
