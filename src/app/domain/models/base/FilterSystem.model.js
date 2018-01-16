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
          },

          FilterSystemType: {
            localField: 'filterSystemType',
            localKey: 'filterSystemTypeId'
          }

        },

        hasMany: {
          ServiceItem: {
            localField: 'serviceItem',
            foreignKey: 'filterSystemId'
          }
        }

      },

      methods: {
        isValid
      },

      meta: {
        label: {
          add: 'Nauja filtravimo sistema'
        }
      }

    });

    function isValid(data) {
      return this.filterSystemTypeId || _.get(data, 'filterSystemTypeId.ready') &&
        this.brandId || _.get(data, 'brandId.ready') &&
        this.name;
    }

  });

})();
