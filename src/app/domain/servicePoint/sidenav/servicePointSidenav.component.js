(function (module) {

  module.component('servicePointSidenav', {
    bindings: {
      servicePoints: '=',
      currentServicePointId: '=',
      servicePointClickFn: '=',
      currentIdx: '=',
      promise: '='
    },
    templateUrl: 'app/domain/servicePoint/sidenav/servicePointSidenav.html',
    controller: servicePointSidenav,
    controllerAs: 'vm'

  });

  function servicePointSidenav(saControllerHelper, $scope, $q) {

    const vm = saControllerHelper.setup(this, $scope);
    const servicePointHeight = 53;

    vm.use({
      restoreScrollPosition
    });

    function restoreScrollPosition() {

      $q.when(vm.promise).then((res) => {

        if (vm.servicePoints.length <= 1) {
          vm.servicePoints = res[1];
        }

        let servicePoints = _.orderBy(vm.servicePoints, ['name'], ['asc']);
        let idx = _.findIndex(servicePoints, {id: vm.currentServicePointId});
        let scrollingBlock = document.getElementById('sidenav-scroll-list');

        setTimeout(() => {
          scrollingBlock.scrollTop = (idx) * servicePointHeight;
        });

      });

    }

  }

})(angular.module('webPage'));
