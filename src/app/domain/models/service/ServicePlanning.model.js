'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServicePlanning',

      relations: {
        hasOne: {
          Employee: {
            localField: 'servingMaster',
            localKey: 'servingMasterId'
          },
          ServiceItem: {
            localField: 'serviceItem',
            localKey: 'serviceItemId'
          }
        }
      },

      methods: {

        serviceStatusCode() {

          const { serviceItem, service } = this;

          if (service && service.type) {
            return service.type;
          } else if (serviceItem.pausedFrom) {
            return 'paused';
          }

          return 'serving';

        },

      },

    });

  });

})();
