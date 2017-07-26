(function (module) {

  module.component('editServicePoint', {

    bindings: {
      servicePoint: '=',
      saveFn: '='
    },

    templateUrl: 'app/domain/servicePoint/editServicePoint/editServicePoint.html',
    controller: editServicePointController,
    controllerAs: 'vm'

  });

  function editServicePointController() {
  }

})(angular.module('webPage'));
