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

      },

      meta:{
        label: {add: 'Naujas Filtravimo Sistemos Tipas'}
      },

      methods: {
        isValid
      }

    });

    function isValid() {
      return this.name;
    }

  });

})();
