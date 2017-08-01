(function (module) {

  module.component('siteList', {

    bindings: {
      sites: '='
    },

    templateUrl: 'app/domain/site/list/siteList.html',
    controller: siteListController,
    controllerAs: 'vm'

  });

  function siteListController() {
  }

})(angular.module('webPage'));