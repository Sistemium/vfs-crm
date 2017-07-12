'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Brand',

      relations: {
        hasMany: {
          FilterSystem: {
            localField: 'filterSystem',
            foreignKey: 'brandId'
          }
        }
      }

    });

  });

})();
