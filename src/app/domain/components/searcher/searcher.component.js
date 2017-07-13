(function (module) {

  module.component('searcher', {

    templateUrl: 'app/domain/components/searcher/searcher.html',
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
