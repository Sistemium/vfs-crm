(function (module) {

  module.component('editServiceContract', {

    bindings: {
      serviceContract: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/serviceContract/editServiceContract/editServiceContract.html',
    controller: editServiceContract,
    controllerAs: 'vm'

  });

  function editServiceContract($scope, ReadyStateHelper, Schema, $state) {

    const vm = ReadyStateHelper.setupController(this, $scope, 'serviceContract');

    vm.use({
      $onInit,
      listGroupItemClick
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

    function listGroupItemClick(item) {
      $state.go('servicePoint.detailed', {servicePointId: item.id});
    }

  }

})(angular.module('webPage'));
