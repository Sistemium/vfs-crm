'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Brand',

      relations: {
        hasMany: {
          FilterSystem: {
            localField: 'filterSystems',
            foreignKey: 'brandId'
          }
        }
      },

      meta: {
        label: {
          add: 'Naujas prekių ženklas'
        }
      }

    });

  });

})();
