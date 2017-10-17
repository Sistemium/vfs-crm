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

  function editServicePointContactController() {
  }

})(angular.module('webPage'));
