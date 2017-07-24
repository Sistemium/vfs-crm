(function (module) {

  module.component('servicePointMaster', {

    templateUrl: 'app/domain/servicePoint/servicePointMaster.html',
    controller: servicePointMasterController,
    controllerAs: 'vm'

  });

  function servicePointMasterController($scope, Schema, saControllerHelper, $state, $filter) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, ServicePoint} = Schema.models();

    vm.use({
      servicePointClick,
      onStateChange
    });

    vm.watchScope('vm.searchText', onSearch);

    onStateChange($state.current, $state.params);
    refresh();

    /*
     Functions
     */

    function onSearch() {

      let {searchText} = vm;

      vm.servicePoints = searchText ? $filter('filter')(vm.data, searchText) : vm.data;

    }

    vm.rebindAll(ServicePoint, {}, 'vm.data', onSearch);

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

      vm.promise = vm.setBusy(busy);

    }

  }

})(angular.module('webPage'));