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
    const vm = ReadyStateHelper.setupController(this, $scope, 'street');
  }

})(angular.module('webPage'));
