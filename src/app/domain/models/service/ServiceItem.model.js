'use strict';

(function () {

  angular.module('Models').run(function (Schema, moment) {

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
          },
          ServiceItemService: {
            localField: 'services',
            foreignKey: 'serviceItemId'
          }
        }

      },

      methods: {
        isValid,
        guaranteeEnd,
        guaranteePeriodFn
      },

      meta: {
        label: {
          add: 'Naujas Įrenginys'
        }
      }

    });

    function guaranteePeriodFn() {

      let {guaranteePeriod} = this;

      return _.isNumber(guaranteePeriod) ? guaranteePeriod : (
        _.get(this.filterSystem, 'guaranteePeriod') ||
        _.get(this.filterSystem, 'filterSystemType.guaranteePeriod')
      );

    }

    function guaranteeEnd() {
      let {installingDate} = this;
      return installingDate && moment(installingDate).add(this.guaranteePeriodFn(), 'months');
    }

    function isValid(data) {
      return this.filterSystemId || _.get(data, 'filterSystemId.ready')
    }

  });

})();
