'use strict';

(function () {

  angular.module('Models').run((Schema, $q) => {

    Schema.register({

      name: 'LegalEntity',

      relations: {

        hasOne: {
          Locality: {
            localField: 'locality',
            localKey: 'localityId'
          },

          Street: {
            localField: 'street',
            localKey: 'streetId'
          },
        },

        hasMany: {
          ServiceContract: {
            localField: 'serviceContracts',
            foreignKey: 'customerLegalEntityId'
          },
          Contact: {
            localField: 'contacts',
            foreignKey: 'ownerXid'
          }
        }

      },

      methods: {
        isValid,
        refreshCache,
        primaryEmail,
        primaryPhone,
        contactsLazy,
        allPhones,
        allEmails
      },

      meta: {
        label: {
          add: 'Nauja įmonė',
          genitive: 'Įmonės'
        }
      },

      // afterCreate: function (model, instance) {
      //
      //   return _.result(instance, 'refreshCache');
      //
      // }

    });

    function isValid() {
      return this.name && this.code;
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

    function refreshCache() {
      delete cache[this.id];
      this.contactsLazy();
    }

    function contactsLazy() {

      let cached = cache[this.id];

      if (cached) return cached;

      cache[this.id] = $q.when(this.contacts)
        .then(res => res.length ? this : this.DSLoadRelations('Contact'))
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
