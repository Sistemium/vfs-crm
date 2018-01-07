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

      const {serviceContract} = vm;
      const {Brand, FilterSystemType, FilterSystem, Site} = Schema.models();


      if (!serviceContract.id && serviceContract.hasOwnProperty('siteId')) {
        vm.hideSite = true;
      } else if (serviceContract && !serviceContract.id) {
        serviceContract.siteId = _.get(Site.meta.getCurrent(), 'id');
        vm.hideSite = true;
      }

      vm.legalType = serviceContract.legalType;

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
