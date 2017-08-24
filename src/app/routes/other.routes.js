'use strict';

(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'settings',
          url: '/settings',
          template: '<menu-settings></menu-settings>',

          data: {
            title: 'Nustatymai'
          }

        })

        .state({

          name: 'brand',
          url: '/brand',
          template: '<brand-master></brand-master>',

          data: {
            title: 'Prekių Ženklai'
          }

        })

        .state({

          name: 'filterSystemType',
          url: '/filterSystemType',
          template: '<filter-system-type-master></filter-system-type-master>',

          data: {
            title: 'Filtravimo Sistemų Tipai'
          }

        })

        .state({

          name: 'site',
          url: '/site',
          template: '<site-master></site-master>',

          data: {
            title: 'Padaliniai'
          }

        });

    });

})();
