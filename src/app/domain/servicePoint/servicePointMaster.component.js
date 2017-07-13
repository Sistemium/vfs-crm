(function (module) {

  module.component('servicePointMaster', {

    templateUrl: 'app/domain/servicePoint/servicePointMaster.html',
    controller: servicePointMasterController,
    controllerAs: 'vm'

  });

  function servicePointMasterController($scope, Schema, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, ServicePoint} = Schema.models();

    vm.use({
      servicePointClick,
      onStateChange
    });

    vm.rebindAll(ServicePoint, {}, 'vm.data');

    onStateChange($state.current, $state.params);
    refresh();

    /*
     Functions
     */

    function onStateChange(to, params) {
      vm.servicePointId = to.name === 'servicePoints.detailed' ? params.servicePointId : null;
    }

    function servicePointClick(servicePoint, idx) {
      vm.idx = idx;

      $state.go('servicePoints.detailed', {servicePointId: servicePoint.id});

    }

    function refresh() {

      let busy = [
        Employee.findAll(),
        ServicePoint.findAll()
      ];

      vm.lol = vm.setBusy(busy);


    }

  }

})(angular.module('webPage'));
