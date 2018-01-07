'use strict';

(function () {

  angular.module('Models').run(function (Schema, localStorageService, $q) {

    let current;

    const Site = Schema.register({

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

      meta: {
        label: {
          add: 'Naujas padalinys'
        },
        getCurrent,
        setCurrent,
        initCurrent
      }

    });

    function initCurrent() {

      let id = localStorageService.get('site.current.id');

      if (!id) {
        return $q.resolve();
      }

      return Site.find(id)
        .then(site => current = site);

    }

    function setCurrent(item) {
      localStorageService.set('site.current.id', _.get(item, 'id') || null);
      current = item;
    }

    function getCurrent() {
      return current;
    }

    function isValid() {
      return this.name && this.code;
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
