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
          },
          Contact: {
            localField: 'contacts',
            foreignKey: 'ownerXid'
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

        name: ['firstName', 'lastName', name]

      },

      methods: {
        isValid,
        primaryEmail,
        primaryPhone,
        refreshCache,
        contactsLazy,
        allPhones,
        allEmails,
        setNames
      },

      meta: {
        label: {
          add: 'Naujas asmuo',
          genitive: 'Asmens'
        },
        mobileNumberMask: '+370 (999) 99-999'
      },

      beforeCreateInstance: function (model, person) {

        setNames.call(person, person.name);

        return person;

      }

    });

    function setNames(name) {

      let hasSpace = /(.+) (.+)/;

      if (hasSpace.test(name)) {

        let names = name.match(hasSpace);

        _.assign(this, {
          firstName: _.upperFirst(names[1]),
          lastName: _.upperFirst(names[2])
        });

      }

    }

    function isValid() {
      return this.firstName && this.lastName;
    }

    function name(firstName, lastName) {
      return (firstName && lastName) ? `${firstName} ${lastName}` : null;
    }

    function primaryEmail() {
      return _.get(this.contactsLazy(), 'primaryEmail');
    }

    function primaryPhone() {
      return _.get(this.contactsLazy(), 'primaryPhone');
    }

    function allPhones() {
      return _.get(this.contactsLazy(), 'allPhones');
    }

    function allEmails() {
      return _.get(this.contactsLazy(), 'allEmails');
    }

    const cache = {};

    // TODO: bindAll to watch changes an refresh cache

    function refreshCache() {
      delete cache[this.id];
      this.contactsLazy();
    }

    function contactsLazy() {

      let cached = cache[this.id];

      if (cached) return cached;

      cache[this.id] = this.DSLoadRelations('Contact')
        .then(res => {
          cache[this.id] = {
            primaryPhone: primaryAddress(res.contacts, 'phone'),
            primaryEmail: primaryAddress(res.contacts, 'email'),
            allPhones: getContacts(res.contacts, 'phone'),
            allEmails: getContacts(res.contacts, 'email')
          };
        });
    }

    function primaryAddress(contacts, code) {
      return _.find(contacts, contact => _.get(contact, 'contactMethod.code') === code);
    }

    function getContacts(contacts, code) {
      return _.sortBy(_.filter(contacts, contact => _.get(contact, 'contactMethod.code') === code), 'address');
    }

  });

})();
