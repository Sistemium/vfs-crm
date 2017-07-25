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
      }

    });

  });

})();
