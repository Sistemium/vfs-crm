'use strict';

(function () {

  angular.module('Models').run(function (Schema, util) {

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
        recentServingMaster,
        allContacts,
      },

      defaultValues: {
        type: 'Gyvenamoji'
      },

      meta: {
        label: {
          add: 'Naujas Aptarnavimo Taškas'
        },

        filter: filterServicePoints,
        orderBy
      }

    });

    function allContacts() {

      let contractPerson = _.get(this, 'currentServiceContract.customerPerson');

      const res = _.map(this.servicePointContacts, c => {
        return { person: c.person, servicePointContact: c };
      });

      if (contractPerson) {
        res.push({ person: contractPerson });
      }

      let contractLegalEntity = _.get(this, 'currentServiceContract.customerLegalEntity');

      if (contractLegalEntity) {
        res.push({ person: contractLegalEntity });
      }

      return res;

    }

    function orderBy(point) {

      let customer = _.result(point, 'currentServiceContract.customer');
      let name = _.get(customer, 'name') || '';

      return `${name}|${point.address}`;

    }

    function recentServingMaster() {
      return _.get(_.find(this.servingItemsLazy(), 'servingMasterId'), 'servingMaster');
    }

    function filterServicePoints(data, text) {

      if (!text) return data;

      let re = util.searchRe(text);

      return _.filter(data, item => {

        if (re.test(item.address)) return true;

        let contract = _.result(item, 'currentServiceContract.name');

        return re.test(contract) ||
          _.find(item.servingItems, serviceItem => {
            return re.test(_.get(serviceItem, 'servingMaster.name')) ||
              re.test(_.get(serviceItem, 'filterSystem.name'));
          });

      });

    }

    function concatAddress() {

      let { locality, street, house, apartment } = this;

      if (!locality) return null;

      `${locality.name}${street ? ', ' + street.name : ''}${house ? ' ' + house : ''}`;

      return _.filter([
        _.filter([locality.name, street && street.name]).join(', '),
        _.filter([house, apartment]).join('-'),
      ]).join(' ');

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

      if (!cached) {
        cache[this.id] = [];
        this.DSLoadRelations('ServiceItem')
          .then(res => cache[this.id] = _.orderBy(res.servingItems, ['lastServiceDate'], ['desc']));
      }

      return cache[this.id];

    }

  });

})();
