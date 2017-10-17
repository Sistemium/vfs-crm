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

  function editFilterSystemTypeController() {

  }

})(angular.module('webPage'));
