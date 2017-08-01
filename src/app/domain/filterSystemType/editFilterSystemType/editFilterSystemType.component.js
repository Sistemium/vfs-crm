(function (module) {

  module.component('editFilterSystemType', {

    bindings: {
      filterSystemType: '='
    },

    templateUrl: 'app/domain/filterSystemType/editFilterSystemType/editFilterSystemType.html',
    controller: editFilterSystemTypeController,
    controllerAs: 'vm'

  });

  function editFilterSystemTypeController() {

  }

})(angular.module('webPage'));
