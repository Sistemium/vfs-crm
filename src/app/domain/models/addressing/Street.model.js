'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Street',

      relations: {

        hasOne: {
          Locality: {
            localField: 'locality',
            localKey: 'localityId'
          }
        }

      },

      meta:{
        label: {add: 'Nauja gatvė'}
      },

      methods: {
        isValid
      }

    });

    function isValid() {
      return this.name && this.localityId;
    }

  });

})();
