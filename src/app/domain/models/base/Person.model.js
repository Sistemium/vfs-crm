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
        telHref: ['phone', telHref]

      },

      methods: {
        isValid
      },

      meta: {
        label: {
          add: 'Naujas asmuo'
        },
        mobileNumberMask: '+370 (999) 99-999'
      },

      beforeCreateInstance: function (model, person) {

        let hasSpace = /(.+) (.+)/;

        if (hasSpace.test(person.name)) {

          let names = person.name.match(hasSpace);

          _.assign(person, {
            firstName: _.upperFirst(names[1]),
            lastName: _.upperFirst(names[2])
          });

        }

        return person;

      }

    });

    function isValid() {
      return this.firstName && this.lastName;
    }

    function telHref(phone) {
      return phone ? `tel://370${_.replace(phone, /[^0-9]/g, '')}` : null;
    }

    function name(firstName, lastName) {
      return (firstName && lastName) ? `${firstName} ${lastName}` : null;
    }

  });

})();
