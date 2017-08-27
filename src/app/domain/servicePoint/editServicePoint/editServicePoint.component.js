(function (module) {

  module.component('editServicePoint', {

    bindings: {
      servicePoint: '=',
      saveFn: '='
    },

    templateUrl: 'app/domain/servicePoint/editServicePoint/editServicePoint.html',
    controller: editServicePointController,
    controllerAs: 'vm'

  });

  function editServicePointController(saControllerHelper, $scope) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit
    });

    function $onInit() {

      let {servicePoint} = vm;

      servicePoint && servicePoint.DSLoadRelations('Street')
        .then(() => servicePoint.street && servicePoint.street.DSLoadRelations())
        .then(() => {
          let locality = _.get(servicePoint, 'street.locality') || {};
          vm.use({
            districtId: locality.districtId,
            localityId: locality.id
          })
        });

      vm.watchScope('vm.servicePoint', onChange, true);

    }

    function onChange(servicePoint) {
      if (!servicePoint) return;
      servicePoint.address = servicePoint.concatAddress();
    }

  }

})(angular.module('webPage'));
