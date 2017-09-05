(function (module) {

  module.component('editServiceContract', {

    bindings: {
      serviceContract: '='
    },

    templateUrl: 'app/domain/serviceContract/editServiceContract/editServiceContract.html',
    controller: editServiceContract,
    controllerAs: 'vm'

  });

  function editServiceContract($scope, saControllerHelper, Schema) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit
    });

    /*
     Functions
     */

    function $onInit() {

      if (vm.serviceContract.siteId) {
        vm.hideSite = true;
      }

      const {Brand, FilterSystemType, FilterSystem} = Schema.models();

      vm.serviceContract.DSLoadRelations()
        .then(serviceContract => {
          return _.map(serviceContract.servicePoints, servicePoint => {
            return servicePoint.DSLoadRelations();
          });
        })
        .then(() => {
          Brand.findAll();
          FilterSystemType.findAll();
          FilterSystem.findAll();
        });

    }

  }

})(angular.module('webPage'));
