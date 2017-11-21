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
      },

      computed: {
        href: ['address', 'contactMethodId', href]
      }

    });

    function href(address, contactMethodId) {

      if (!address) {
        return;
      }

      const {ContactMethod} = Schema.models();

      let {link} = ContactMethod.get(contactMethodId);

      return link + address;

    }

  });

})();
