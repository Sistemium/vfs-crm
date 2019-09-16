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
        other: {
          a: 'Komentaras',
          b: 'Sekančiam aptarnavimui',
        },
      },

      saveItemServiceClick() {

        const { serviceItemId, servingMasterId, id } = this.servicePlanning;
        const { newServiceInfo, nextServiceInfo, newServiceDate, type } = this;

        let date = newServiceDate;
        let nextServiceDate = null;

        if (type === 'forward') {
          date = moment(this.monthDate).format('YYYY-MM-DD');
          nextServiceDate = newServiceDate;
        }

        ServiceItemService.create({
          serviceItemId,
          servingMasterId,
          nextServiceInfo,
          type,
          date,
          nextServiceDate,
          info: newServiceInfo,
        })
          .then(service => {
            return ServicePlanning.find(id, { bypassCache: true })
              .then(planning => ServiceItem.find(serviceItemId, { bypassCache: true })
                .then(item => $rootScope.$broadcast('ServicePlanningUpdated', planning, service, item))
              );
          });

      },

      onDate(date) {
        if (moment(date) > moment(this.monthDate).add(1, 'month')) {
          this.type = 'forward';
        }
      },

    })
      .watchScope('vm.newServiceDate', date => this.onDate(date));

    /*
    Functions
     */

  }

})();