(function () {

  angular.module('webPage')
    .directive('rootNavbar', rootNavbar);

  function rootNavbar() {
    return {

      restrict: 'E',
      templateUrl: 'app/domain/components/navbar/root-navbar.html',

      scope: {},

      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true

    };
  }

  function NavbarController(Menu, $scope, $rootScope, saControllerHelper, $window, localStorageService, $state) {

    const DEFAULT_TITLE = 'Pagrindinis Meniu';
    const vm = saControllerHelper.setup(this, $scope);

    vm.use({

      menu: Menu.root(),
      rootClick,

      rootIcon: '/images/Aquafilter-lt.png'

    });

    onStateChange({}, $state.current);

    $scope.$on('$stateChangeSuccess', onStateChange);
    $scope.$on('$stateChangeStart', onStateChange);

    /*
     Functions
     */

    function rootClick() {

      if (vm.isSubRootState) {
        return $state.go(vm.rootState);
      }

      $rootScope.$broadcast('rootClick');

    }

    function onStateChange(event, to) {

      let rootState = _.get(to, 'data.rootState');
      let currentItem = _.find(vm.menu.items, item => to.name && _.startsWith(to.name, item.state));


      vm.use({

        rootState,
        hide: !!_.get(to, 'data.hideTopBar'),
        hideNavs: !!_.get(to, 'data.hideNavs'),
        title: _.get(to, 'data.title') || DEFAULT_TITLE,
        isHomeState: to.name === 'home',
        currentItem,
        isSubRootState: _.startsWith(to.name, rootState) && to.name !== rootState,
        currentIcon: `/images/${currentItem ? 'color/' + currentItem.icon : 'Aquafilter-lt.png'}`

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

})();
