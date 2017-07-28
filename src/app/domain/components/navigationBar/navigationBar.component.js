(function (module) {

  module.component('navigationBar', {

    bindings: {
      stateName: '@',
      searchText: '=?',
      editClickFn: '='
    },

    templateUrl: 'app/domain/components/navigationBar/navigationBar.html',
    controller: navigationBarController,
    controllerAs: 'vm'

  });

  function navigationBarController($scope, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      tableViewClick,
      tilesViewClick,
      $onInit,
      onStateChange
    });

    /*
     Functions
     */

    function $onInit() {
      vm.viewButtons = !!vm.stateName;
      onStateChange($state.current);
    }

    function onStateChange(to) {
      vm.currentState = _.last(to.name.match(/[^.]+$/))
    }

    function tilesViewClick() {
      $state.go(`${vm.stateName}.tiles`);
    }

    function tableViewClick() {
      $state.go(`${vm.stateName}.table`);
      vm.active = 'table'
    }

  }

})(angular.module('webPage'));
