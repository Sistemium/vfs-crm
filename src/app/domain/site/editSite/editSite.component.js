(function (module) {

  module.component('editSite', {

    bindings: {
      site: '='
    },

    templateUrl: 'app/domain/site/editSite/editSite.html',
    controller: editFilterSystemTypeController,
    controllerAs: 'vm'

  });

  function editFilterSystemTypeController() {

  }

})(angular.module('webPage'));
