'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ContactMethod',

      computed: {
        contactRegExp: ['validationPattern', validationPattern => new RegExp(validationPattern)
        ]
      }

    })
    ;

  });

})();
