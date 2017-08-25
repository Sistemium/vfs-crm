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

    const genitive = {
      Vilnius: 'Vilniaus',
      Kaunas: 'Kauno',
      'Klaipėda': 'Klaipėdos'
    };

    function declension() {
      return genitive[this.name] || this.name;
    }

  });

})();
