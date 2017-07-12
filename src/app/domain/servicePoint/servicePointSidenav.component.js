(function (module) {

  module.component('servicePointSidenav', {
    bindings: {
      servicePoints: '=',
      currentServicePointId: '=',
      servicePointClickFn: '=',
      currentIdx: '='
    },
    templateUrl: 'app/domain/servicePoint/servicePointSidenav.html',
    controller: servicePointSidenav,
    controllerAs: 'vm'

  });

  function servicePointSidenav(saControllerHelper, $scope) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit
    });

    function $onInit() {
      let scrollingBlock = document.getElementsByClassName('service-point-sidenav');
      console.log(scrollingBlock[0].offsetTop);
      scrollingBlock[0].scrollTop = vm.currentIdx * 53;
      console.log('Should be ', vm.currentIdx * 53);

    }

  }

})(angular.module('webPage'));
