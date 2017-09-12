'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Locality',

      relations: {

        hasOne: {
          District: {
            localField: 'district',
            localKey: 'districtId'
          }
        }

      },

      meta:{
        label: {add: 'Nauja gyvenomoji vieta'}
      },

      methods: {
        isValid
      }

    });

    function isValid() {
      return this.name && this.districtId;
    }

  });

})();
