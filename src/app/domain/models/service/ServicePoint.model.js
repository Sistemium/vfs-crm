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

          Locality: {
            localField: 'locality',
            localKey: 'localityId'
          },

          Street: {
            localField: 'street',
            localKey: 'streetId'
          },

          ServiceContract: {
            localField: 'currentServiceContract',
            localKey: 'currentServiceContractId'
          },

          Location: {
            localField: 'location',
            localKey: 'locationId'
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
        refreshCache,
        recentServingMaster
      },

      meta: {
        label: {
          add: 'Naujas Aptarnavimo Taškas'
        },

        filter: filterServicePoints
      }

    });

    function recentServingMaster() {
      return _.get(_.find(this.servingItemsLazy(), 'servingMasterId'), 'servingMaster');
    }

    function filterServicePoints(data, text) {

      if (!text) return data;

      let re = new RegExp(_.escapeRegExp(text), 'i');

      return _.filter(data, item => {

        if (re.test(item.address)) return true;

        let contract = _.result(item, 'currentServiceContract.name');

        return re.test(contract);

      });

    }

    function concatAddress() {

      let {locality, street, house} = this;

      if (!locality) return null;

      return `${locality.name}${street ? ', ' + street.name : ''}${house ? ' ' + house : ''}`;

    }

    function isValid() {
      return this.siteId &&
        this.address &&
        this.localityId;
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
