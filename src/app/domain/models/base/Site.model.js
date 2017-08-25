'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Site',

      relations: {
        hasOne: {
          ServicePoint: {
            localField: 'site',
            localKey: 'siteId'
          }
        }
      },

      methods: {
        isValid,
        declension
      },

      meta: {}

    });

    function isValid() {
      return this.name;
    }

    function declension() {

      if (this.name === 'Vilnius') {
        return 'Vilniaus'
      } else if (this.name === 'Klaipėda') {
        return 'Klaipėdos'
      } else if (this.name === 'Kaunas') {
        return 'Kauno'
      }else{
        return this.name
      }

    }

  });

})();
