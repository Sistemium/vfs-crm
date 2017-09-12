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
          add: 'Nauja filtro sistema'
        }
      }

    });

    function isValid() {
      return this.filterSystemTypeId && this.brandId && this.name;
    }

  });

})();
