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
        type: 'service',
        placeholder: {
          service: {
            a: 'Papildomas aptarnavimas',
            b: 'Sekančiam aptarnavimui',
          },
          pause: {
            a: 'Komentaras',
            b: 'Sekančiam aptarnavimui',
          },
          forward: {
            a: 'Priežastis',
            b: 'Sekančiam aptarnavimui',
          },
        },
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
      const { newServiceInfo, nextServiceInfo, newServiceDate, type } = vm;

      ServiceItemService.create({
        serviceItemId,
        servingMasterId,
        nextServiceInfo,
        type,
        date: newServiceDate,
        info: newServiceInfo,
      })
        .then(() => ServicePlanning.find(id, { bypassCache: true }));
    }

  }

})();