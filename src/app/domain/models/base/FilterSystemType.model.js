'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'FilterSystemType',

      relations: {

        hasMany: {
          FilterSystem: {
            localField: 'filterSystem',
            foreignKey: 'filterSystemTypeId'
          }
        }

      }

    });

  });

})();
