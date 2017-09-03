(function (module) {

  module.component('servicePointSidenav', {

    bindings: {
      servicePoints: '=',
      currentServicePointId: '=',
      servicePointClickFn: '=',
      currentIdx: '=',
      promise: '=',
      addClick: '&'
    },

    templateUrl: 'app/domain/servicePoint/sidenav/servicePointSidenav.html',
    controller: servicePointSidenav,
    controllerAs: 'vm'

  });

  function servicePointSidenav(saControllerHelper, $scope, $q, $filter, Schema, $state, $timeout, saEtc) {

    const vm = saControllerHelper.setup(this, $scope);
    const servicePointHeight = 53;

    const {ServicePoint} = Schema.models();

    vm.watchScope('vm.searchText', onSearch);
    vm.rebindAll(ServicePoint, {}, 'vm.data', onSearch);

    vm.use({
      restoreScrollPosition,
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
      vm.servicePoints = $filter('orderBy')(vm.servicePoints, 'name');

    }

    function restoreScrollPosition() {

      $q.when(vm.promise).then((res) => {

        if (vm.servicePoints.length <= 1) {
          vm.servicePoints = res[1];
        }

        vm.servicePoints = $filter('orderBy')(vm.servicePoints, 'name');

        let servicePoints = _.orderBy(vm.servicePoints, ['name'], ['asc']);
        let idx = _.findIndex(servicePoints, {id: vm.currentServicePointId});

        $timeout(100).then(() => {

          let scrollingBlock = saEtc.getElementById('sidenav-scroll-list');

          if (!scrollingBlock) {
            console.error('no scrollingBlock');
            return;
          }

          scrollingBlock.scrollTop = (idx) * servicePointHeight;
          vm.lastIndex = idx;
          vm.watchScope('vm.currentServicePointId', onIdxChange);

        });

      });

    }

  }

})(angular.module('webPage'));
