(function (module) {

  module.component('editStreet', {

    bindings: {
      street: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/addressing/editStreet/editStreet.html',
    controllerAs: 'vm',
    controller: editStreetController

  });

  function editStreetController($scope, ReadyStateHelper) {
    ReadyStateHelper.setupController(this, $scope, 'street');
  }

})(angular.module('webPage'));
