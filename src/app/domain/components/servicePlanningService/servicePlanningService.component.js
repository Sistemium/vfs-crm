(function () {

  angular.module('webPage')
    .component('servicePlanningService', {

      bindings: {
        servicePlanning: '<',
        monthDate: '<',
        minDate: '<',
      },

      templateUrl: 'app/domain/components/servicePlanningService/servicePlanningService.html',
      controller: servicePlanningServiceController,
      controllerAs: 'vm'

    });

  function servicePlanningServiceController($scope, saControllerHelper, Schema, $q, moment, $rootScope) {

    const {
      ServiceItemService,
      ServicePlanning,
      ServiceItem,
    } = Schema.models('');

    saControllerHelper.setup(this, $scope).use({

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

      saveItemServiceClick() {

        const { serviceItemId, servingMasterId, id, serviceItem } = this.servicePlanning;
        const { newServiceInfo, nextServiceInfo, newServiceDate, type } = this;

        let date = newServiceDate;

        const promises = [];

        if (type === 'pause') {
          serviceItem.pausedFrom = newServiceDate;
          promises.push(serviceItem.DSCreate());
        } else if (type === 'forward') {
          date = moment(this.monthDate).format('YYYY-MM-DD');
          serviceItem.nextServiceDate = newServiceDate;
          promises.push(serviceItem.DSCreate());
        }

        $q.all(promises)
          .then(() => ServiceItemService.create({
            serviceItemId,
            servingMasterId,
            nextServiceInfo,
            type,
            date,
            info: newServiceInfo,
          }))
          .then(service => {
            return ServicePlanning.find(id, { bypassCache: true })
              .then(planning => ServiceItem.find(serviceItemId, { bypassCache: true })
                .then(item => $rootScope.$broadcast('ServicePlanningUpdated', planning, service, item))
              );
          });

      },

    });

    /*
    Functions
     */

  }

})();