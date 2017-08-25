'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'District',

      relations: {
        hasMany: {
          Locality: {
            localField: 'localities',
            foreignKey: 'districtId'
          }
        }
      },

      meta: {
        label: {
          add: 'Naujas apskritis'
        }
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
