'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServiceItem',

      relations: {

        hasOne: {
          ServiceContract: {
            localField: 'currentServiceContract',
            localKey: 'currentServiceContractId'
          },
          ServicePoint: {
            localField: 'servicePoint',
            localKey: 'servicePointId'
          },
          FilterSystem: {
            localField: 'filterSystem',
            localKey: 'filterSystemId'
          },
          Employee: [{
            localField: 'installingMaster',
            localKey: 'installingMasterId'
          }, {
            localField: 'servingMaster',
            localKey: 'servingMasterId'
          }]

        },

        hasMany: {
          ServiceContractItem: {
            localField: 'serviceContractItems',
            foreignKey: 'serviceItemId'
          }
        }

      },

      methods: {
        isValid
      },

      meta: {
        label: {
          add: 'Naujas Įrenginys'
        }
      }

    });

    function isValid() {
      return this.filterSystemId
    }

  });

})();
