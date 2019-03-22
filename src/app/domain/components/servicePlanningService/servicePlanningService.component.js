(function () {

  angular.module('webPage')
    .component('servicePlanningService', {

      bindings: {
        servicePlanning: '<',
        monthDate: '<',
      },

      templateUrl: 'app/domain/components/servicePlanningService/servicePlanningService.html',
      controller: servicePlanningServiceController,
      controllerAs: 'vm'

    });

  function servicePlanningServiceController($scope, saControllerHelper, Schema) {

    const vm = saControllerHelper.setup(this, $scope)
      .use({
        saveItemServiceClick,
        newServiceDate: null,
        nextServiceDate: null,
        nextServiceInfo: '',
        newServiceInfo: '',
      });

    const {
      ServiceItemService,
      ServicePlanning,
    } = Schema.models('');


    /*
    Functions
     */

    function saveItemServiceClick() {

      const { serviceItemId, servingMasterId, id } = vm.servicePlanning;
      const { newServiceInfo, nextServiceInfo, newServiceDate } = vm;

      ServiceItemService.create({
        serviceItemId,
        servingMasterId,
        nextServiceInfo,
        date: newServiceDate,
        info: newServiceInfo,
      })
        .then(() => ServicePlanning.find(id, { bypassCache: true }));
    }

  }

})();