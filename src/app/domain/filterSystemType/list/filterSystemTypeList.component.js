(function (module) {

  module.component('filterSystemTypeList', {

    bindings: {
      filterSystemTypes: '='
    },

    templateUrl: 'app/domain/filterSystemType/list/filterSystemTypeList.html',
    controller: filterSystemTypeListController,
    controllerAs: 'vm'

  });

  function filterSystemTypeListController() {
  }

})(angular.module('webPage'));