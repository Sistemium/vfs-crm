(function (module) {

  module.component('editServiceContract', {

    bindings: {
      serviceContract: '='
    },

    templateUrl: 'app/domain/serviceContract/editServiceContract/editServiceContract.html',
    controller: editServiceContract,
    controllerAs: 'vm'

  });

  function editServiceContract($scope, saControllerHelper, Schema, $state, moment) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit,
      listGroupItemClick,
      dateTest: vm.serviceContract.date && new Date(vm.serviceContract.date) || new Date(),
      isCalendarOpened: false,
      dateOptions: {
        formatYear: 'yy',
        startingDay: 1,
        showWeeks: false
      }
    });

    /*
     Functions
     */

    $scope.$watch('vm.dateTest', (nv) => {

      if (typeof(nv) === 'undefined') {
        vm.serviceContract.date = null;
        return;
      }

      vm.serviceContract.date = moment(nv).format();
    });

    function $onInit() {

      vm.testDate = new Date();

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
