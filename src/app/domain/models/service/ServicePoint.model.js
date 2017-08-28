'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'ServicePoint',

      relations: {

        hasOne: {

          Employee: {
            localField: 'servingMaster',
            localKey: 'servingMasterId'
          },

          Site: {
            localField: 'site',
            localKey: 'siteId'
          },

          Street: {
            localField: 'street',
            localKey: 'streetId'
          }

        },

        hasMany: {
          ServiceItem: {
            localField: 'servingItems',
            foreignKey: 'servicePointId'
          },
          ServicePointContact: {
            localField: 'servicePointContacts',
            foreignKey: 'servicePointId'
          },
          Picture: {
            localField: 'pictures',
            foreignKey: 'ownerXid'
          }
        }

      },

      methods: {
        servingItemsLazy,
        isValid,
        concatAddress,
        refreshCache
      }

    });

    function concatAddress() {

      let {street, house} = this;

      if (!street) return null;

      return `${_.get(street, 'locality.name')}, ${street.name}${house ? ', ' + house : ''}`;

    }

    function isValid() {
      return this.siteId && this.address && this.name && this.streetId;
    }

    const cache = {};

    // TODO: bindAll to watch changes an refresh cache

    function refreshCache() {
      delete cache[this.id];
      this.servingItemsLazy();
    }

    function servingItemsLazy() {

      let cached = cache[this.id];

      if (cached) return cached;

      cache[this.id] = this.DSLoadRelations('ServiceItem')
        .then(res => cache[this.id] = res.servingItems);

    }

  });

})();
