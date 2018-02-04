'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServiceItemService',

      relations: {
        hasOne: {
          // Employee: {
          //   localField: 'servingMaster',
          //   localKey: 'servingMasterId'
          // },
          ServiceItem: {
            localField: 'serviceItem',
            localKey: 'serviceItemId'
          }
        }
      },

      methods: {
        isValid
      }

    });

    function isValid(data) {
      return this.date && (this.serviceItemId || _.get(data, 'serviceItemId.ready'));
    }

  });

})();
