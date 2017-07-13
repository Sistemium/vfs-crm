'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Employee',

      relations: {
        hasMany: {
          ServicePoint: {
            localField: 'servicePointsAsServingMaster',
            foreignKey: 'servingMasterId'
          }
        },

        hasOne: {
          Person: {
            localField: 'personInfo',
            localKey: 'personId'
          }
        }
      }

    });

  });

})();
