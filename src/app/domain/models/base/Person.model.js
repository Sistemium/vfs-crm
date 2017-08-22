'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Person',

      relations: {

        hasMany: {
          ServiceContract: {
            localField: 'serviceContracts',
            foreignKey: 'customerPersonId'
          }
        },

        hasOne: {
          Picture: {
            localField: 'avatarPicture',
            localKey: 'avatarPictureId'
          }
        }

      },

      computed: {
        name: ['firstName', 'lastName', name],
        telHref: ['phone', function (phone) {
          return phone ? `tel://${_.replace(phone, /[^0-9]/g,'')}` : null;
        }]
      },

      methods: {
        isValid
      },

      meta: {
        label: {
          add: 'Naujas asmuo'
        }
      }

    });

    function isValid() {
      return this.firstName && this.lastName;
    }

    function name(firstName, lastName) {
      return `${firstName} ${lastName}`;
    }

  });

})();
