(function (module) {

  module.component('vfsSearcher', {

    bindings: {
      search: '=',
      focus: '<'
    },

    templateUrl: 'app/domain/components/vfsSearcher/vfsSearcher.html',
    controller: searcherController,
    controllerAs: 'vm'

  });

  function searcherController($scope, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({});

    /*
     Functions
     */

  }

})(angular.module('webPage'));
