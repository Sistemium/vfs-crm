(function (module) {

  module.component('servicePointMaster', {

    templateUrl: 'app/domain/servicePoint/servicePointMaster.html',
    controller: servicePointMasterController,
    controllerAs: 'vm'

  });

  function servicePointMasterController($scope, Schema, saControllerHelper, $state, $filter, Editing) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, ServicePoint, ServiceContract, Person, LegalEntity} = Schema.models();

    vm.use({
      servicePointClick,
      onStateChange,
      addClick
    });

    vm.watchScope('vm.searchText', onSearch);

    onStateChange($state.current, $state.params);
    refresh();

    vm.rebindAll(ServicePoint, {}, 'vm.data', onSearch);

    /*
     Functions
     */

    function addClick() {
      Editing.editModal('edit-service-point', 'Naujas Taškas')(ServicePoint.createInstance())
    }

    function onSearch() {

      let {searchText} = vm;

      vm.servicePoints = searchText ? filterServicePoints(vm.data, searchText) : vm.data;
      vm.servicePoints = $filter('orderBy')(vm.servicePoints, 'address');

    }

    function filterServicePoints(data, text) {

      if (!text) return data;

      let re = new RegExp(_.escapeRegExp(text), 'i');

      return _.filter(data, item => {

        if (re.test(item.address)) return true;

        let contract = _.result(item, 'currentServiceContract.name');

        return re.test(contract);

      });

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

      vm.promise = vm.setBusy(busy);

    }

  }

})(angular.module('webPage'));