(function (module) {

  module.component('servicePointMaster', {

    templateUrl: 'app/domain/servicePoint/servicePointMaster.html',
    controller: servicePointMasterController,
    controllerAs: 'vm'

  });

  function servicePointMasterController($scope, Schema, saControllerHelper, $state, $filter, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, ServicePoint, ServiceContract, Person, LegalEntity, Site} = Schema.models();

    vm.use({
      servicePointClick,
      onStateChange,
      addClick
    });

    vm.watchScope('vm.searchText', onSearch);

    refresh()
      .then(() => {
        vm.watchScope(() => _.get(Site.meta.getCurrent(), 'id'), onSiteChange);
        onStateChange($state.current, $state.params);
      });

    /*
     Functions
     */

    function onSiteChange(siteId) {

      vm.siteId = siteId;

      let filter = {};

      if (siteId) {
        filter.siteId = siteId;
      }

      vm.rebindAll(ServicePoint, filter, 'vm.data', onSearch);

    }

    function addClick() {
      const servicePoint = ServicePoint.createInstance();
      Editing.editModal('edit-service-point', 'Naujas Taškas')(servicePoint)
        .then(() => {
          if (servicePoint && servicePoint.id) {
            $state.go('servicePoint.detailed', {servicePointId: servicePoint.id});
          }
        })
        .catch(_.noop);
    }

    function onSearch() {

      let {searchText} = vm;

      vm.servicePoints = searchText ? ServicePoint.meta.filter(vm.data, searchText) : vm.data;
      vm.servicePoints = $filter('orderBy')(vm.servicePoints, ServicePoint.meta.orderBy);

    }

    function onStateChange(to, params) {
      vm.servicePointId = to.name === 'servicePoint.detailed' ? params.servicePointId : null;
    }

    function servicePointClick(servicePoint, idx) {
      vm.idx = idx;

      $state.go('servicePoint.detailed', {servicePointId: servicePoint.id});

    }

    function refresh() {

      let busy = [
        Person.findAll(),
        LegalEntity.findAll(),
        ServiceContract.findAll(),
        Employee.findAll(),
        ServicePoint.findAll()
      ];

      return (vm.promise = vm.setBusy(busy));

    }

  }

})(angular.module('webPage'));