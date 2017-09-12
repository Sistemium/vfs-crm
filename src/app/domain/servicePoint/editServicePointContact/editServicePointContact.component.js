(function (module) {

  module.component('editServicePointContact', {

    bindings: {
      servicePointContact: '='
    },

    templateUrl: 'app/domain/servicePoint/editServicePointContact/editServicePointContact.html',
    controllerAs: 'vm',
    controller: editServicePointContactController

  });

  function editServicePointContactController() {
  }

})(angular.module('webPage'));
