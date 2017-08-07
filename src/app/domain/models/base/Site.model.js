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
      return true
    }

    function declension() {

      if (this.name === 'Vilnius') {
        return 'Vilniaus'
      } else if (this.name === 'Klaipėda') {
        return 'Klaipėdos'
      } else if (this.name === 'Kaunas') {
        return 'Kauno'
      }

    }

  });

})();
