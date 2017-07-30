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

  })
    .run(routerDecorator);

  function navigationBarController($scope, saControllerHelper, $state, localStorageService) {

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
      saveMode('tiles');
      $state.go(`${vm.stateName}.tiles`);
    }

    function tableViewClick() {
      saveMode('table');
      $state.go(`${vm.stateName}.table`);
    }

    function saveMode(mode) {
      localStorageService.set(`${vm.stateName}.mode`, mode);
    }

  }

  function routerDecorator($rootScope, localStorageService, $state) {

    $rootScope.$on('$stateChangeStart', (event, toState, toParams) => {

      if (!toState.defaultChild) {
        return;
      }

      let mode = localStorageService.get(`${toState.name}.mode`) || toState.defaultChild;

      //if (toParams.item) {
      //  mode += '.item';
      //  toParams = {
      //    id: toParams.item
      //  }
      //}
      event.preventDefault();

      return $state.go(`${toState.name}.${mode}`, toParams, {inherit: false});

    });

  }

})(angular.module('webPage'));
