'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'FilterSystem',

      relations: {

        hasOne: {
          Brand: {
            localField: 'brand',
            localKey: 'brandId'
          }
        },

        hasMany: {
          ServiceItem: {
            localField: 'serviceItem',
            foreignKey: 'filterSystemId'
          }
        }

      }

    });

  });

})();
