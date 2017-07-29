'use strict';

(function () {

  angular.module('webPage')
    .config(function (stateHelperProvider) {

      stateHelperProvider

        .state({

          name: 'filterSystem',
          url: '/filterSystem',
          template: '<filter-system></filter-system>',

          data: {
            title: 'Filtravimo sistemos'
          }

        })
        .state({

          name: 'brand',
          url: '/brand',
          template: '<brand-master></brand-master>',

          data: {
            title: 'Preki ženklai'
          }

        });

    });

})();
