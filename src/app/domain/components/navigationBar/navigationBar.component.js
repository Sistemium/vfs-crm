(function (module) {

  module.component('navigationBar', {

    bindings: {
      viewButtons: '@',
      searchText: '=?',
      stateName: '@'
    },

    templateUrl: 'app/domain/components/navigationBar/navigationBar.html',
    controller: navigationBarController,
    controllerAs: 'vm'

  });

  function navigationBarController($scope, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      goToTable,
      goToTiles,
      active: 'tiles'
    });

    /*
     Functions
     */

    function goToTiles() {
      $state.go(vm.stateName + '.tiles');
      vm.active = 'tiles'
    }

    function goToTable() {
      $state.go(vm.stateName + '.table');
      vm.active = 'table'
    }

  }

})(angular.module('webPage'));
