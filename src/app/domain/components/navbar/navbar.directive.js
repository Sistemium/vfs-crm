(function () {

  function acmeNavbar() {
    return {

      restrict: 'E',
      templateUrl: 'app/domain/components/navbar/root-navbar.html',

      scope: {},

      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true

    };
  }

  function NavbarController(Menu, $scope, $rootScope, saControllerHelper, $window, localStorageService) {

    const DEFAULT_TITLE = 'Главное меню';
    const vm = saControllerHelper.setup(this, $scope);

    vm.use({

      menu: Menu.root(),
      rootClick: () => $rootScope.$broadcast('rootClick')

    });

    $scope.$on('$stateChangeSuccess', onStateChange);
    $scope.$on('$stateChangeStart', onStateChange);

    function onStateChange(event, to) {

      let rootState = _.get(to, 'data.rootState');

      vm.use({
        hide: !!_.get(to, 'data.hideTopBar'),
        hideNavs: !!_.get(to, 'data.hideNavs'),
        title: _.get(to, 'data.title') || DEFAULT_TITLE,
        isHomeState: to.name === 'home',
        currentItem: _.find(vm.menu.items, item => to.name && _.startsWith(to.name, item.state)),
        isSubRootState: _.startsWith(to.name, rootState) && to.name !== rootState
      });

    }

    function measure() {
      let a = $window.performance.now();
      $rootScope.$apply();
      vm.lastDigest = Math.round($window.performance.now() - a);
      setTimeout(measure, 2000);
    }

    if (localStorageService.get('debug.performance')) {
      setTimeout(measure, 1000);
    }


  }

  angular
    .module('webPage')
    .directive('navbar', acmeNavbar);

})();
