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
            localField: 'person',
            localKey: 'personId'
          },

          Site: {
            localField: 'site',
            localKey: 'siteId'
          }

        }

      },

      methods: {
        isValid
      }

    });

    function isValid() {
      return this.personId && this.siteId;
    }

  });

})();
