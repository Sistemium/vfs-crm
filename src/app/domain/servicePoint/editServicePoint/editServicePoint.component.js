(function (module) {

  module.component('editServicePoint', {

    bindings: {
      servicePoint: '=ngModel',
      saveFn: '=',
      readyState: '='
    },

    templateUrl: 'app/domain/servicePoint/editServicePoint/editServicePoint.html',
    controller: editServicePointController,
    controllerAs: 'vm'

  });

  function editServicePointController(saControllerHelper, $scope, ReadyStateHelper) {

    ReadyStateHelper.setupController(this, $scope, 'servicePoint');
    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit,
      newItem: {}
    });

    function $onInit() {

      let {servicePoint} = vm;

      servicePoint && servicePoint.DSLoadRelations(['Street', 'Locality'])
        .then(() => servicePoint.locality && servicePoint.locality.DSLoadRelations())
        .then(() => {
          vm.use({
            districtId: _.get(servicePoint, 'locality.districtId')
          });
          vm.watchScope(addressFields, onChange, true);
          vm.ready = true;
        });

    }

    function addressFields() {
      return _.pick(vm.servicePoint, ['localityId', 'streetId', 'house']);
    }

    function onChange() {
      if (!vm.servicePoint) return;
      vm.servicePoint.address = vm.servicePoint.concatAddress();
    }

  }

})(angular.module('webPage'));
