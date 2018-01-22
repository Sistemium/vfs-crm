(function (module) {

  module.component('servicePointSidenav', {

    bindings: {
      data: '=servicePoints',
      currentServicePointId: '=',
      servicePointClickFn: '=',
      currentIdx: '=',
      addClick: '&'
    },

    templateUrl: 'app/domain/servicePoint/sidenav/servicePointSidenav.html',
    controller: servicePointSidenav,
    controllerAs: 'vm'

  });

  function servicePointSidenav(saControllerHelper, $scope, $filter, Schema, $state, $timeout, saEtc) {

    const vm = saControllerHelper.setup(this, $scope);
    const servicePointHeight = 53;

    const {ServicePoint} = Schema.models();

    vm.watchScope('vm.searchText', onSearch);
    $scope.$watchCollection('vm.data', onSearch);

    vm.use({
      servicePointHeight,
      onScrollListReady: restoreScrollPosition,
      servicePointClick
    });

    /*
     Functions
     */

    function servicePointClick(servicePoint) {
      vm.lastIndex = _.findIndex(vm.servicePoints, {id: servicePoint.id});
      vm.servicePointClickFn(servicePoint);
    }

    function onIdxChange() {

      vm.rebindOne(ServicePoint, vm.currentServicePointId, 'vm.lastSeenId', () => {
        if (!vm.lastSeenId) {

          let newPoint = vm.servicePoints[vm.lastIndex];

          if (!newPoint) {
            return $state.go('^');
          }

          vm.currentServicePointId = newPoint.id;
          vm.servicePointClick(newPoint);

        }
      });

    }

    function onSearch() {

      let {searchText} = vm;

      vm.servicePoints = searchText ? ServicePoint.meta.filter(vm.data, searchText) : vm.data;
      vm.servicePoints = $filter('orderBy')(vm.servicePoints, ServicePoint.meta.orderBy);
      restoreScrollPosition();

    }

    function restoreScrollPosition() {

      let idx = _.findIndex(vm.servicePoints, {id: vm.currentServicePointId});
      let scrollingBlock = saEtc.getElementById('sidenav-scroll-list');

      // console.warn('restoreScrollPosition:', idx, !!scrollingBlock);

      if (!scrollingBlock || idx < 0) {
        return;
      }

      $timeout(100)
        .then(() => {
          scrollingBlock.scrollTop = _.max([(idx - 2) * servicePointHeight - 1, 0]);
          vm.lastIndex = idx;
          vm.watchScope('vm.currentServicePointId', onIdxChange);
        });

    }

  }

})(angular.module('webPage'));
