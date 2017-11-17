'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Contact',

      relations: {
        hasOne: {
          ContactMethod: {
            localField: 'contactMethod',
            localKey: 'contactMethodId'
          }
        }
      }

    });

  });

})();
