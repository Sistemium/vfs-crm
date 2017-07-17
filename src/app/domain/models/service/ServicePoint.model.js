'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServicePoint',

      relations: {

        hasOne: {
          Employee: {
            localField: 'servingMaster',
            localKey: 'servingMasterId'
          }
        },

        hasMany: {
          ServiceItem: {
            localField: 'servingItems',
            foreignKey: 'servicePointId'
          },
          ServicePointContact: {
            localField: 'servicePointContact',
            foreignKey: 'servicePointId'
          }
        }

      }

    });

  });

})();
