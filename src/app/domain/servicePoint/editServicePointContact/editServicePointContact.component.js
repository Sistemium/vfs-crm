(function (module) {

  module.component('editServicePointContact', {

    bindings: {
      servicePointContact: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/servicePoint/editServicePointContact/editServicePointContact.html',
    controllerAs: 'vm',
    controller: editServicePointContactController

  });

  function editServicePointContactController(ReadyStateHelper, $scope) {
    ReadyStateHelper.setupController(this, $scope, 'servicePointContact');
  }

})(angular.module('webPage'));
