(function (module) {

  module.component('addressForm', {

    bindings: {
      addressee: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/addressing/addressForm/addressForm.html',
    controllerAs: 'vm',
    controller: addressFormController,

  });

  function addressFormController($scope, Schema, ReadyStateHelper) {

    const { Street, Locality, District } = Schema.models();


    const vm = ReadyStateHelper.setupController(this, $scope, 'addressee')
      .use({

        districtId: null,
        addressSearch: '',
        ready: false,

        onAddressSearchKeyPress,
        applyAddress,

        $onInit() {
          District.findAll()
            .then(() => {
              const { addressee } = vm;
              return addressee && addressee.DSLoadRelations(['Street', 'Locality'])
                .then(() => addressee.locality && addressee.locality.DSLoadRelations())
                .then(() => {
                  vm.ready = true;
                });
            })
            .then(() => {
              vm.watchScope('vm.addressSearch', onAddressSearch);
              // vm.watchScope('vm.addressee.locality.id', onLocalityChange);
              onLocalityChange();
              vm.watchScope(addressFields, onChange, true);
              // vm.watchScope(addressFields, onChange, true);
            });
        },

      })

    function onLocalityChange() {
      vm.districtId = _.get(vm.addressee, 'locality.districtId');
    }

    function onAddressSearchKeyPress($event) {

      let { keyCode } = $event;

      if (keyCode === 13 && vm.matchingAddresses.length === 1) {
        return applyAddress(vm.matchingAddresses[0]);
      }

      if (_.includes([13, 40], keyCode)) {
        vm.isAddressSearchOpen = true;
      }
    }

    function applyAddress(address) {

      let { street, locality, district, house, apartment } = address;

      _.assign(vm.addressee, {
        localityId: locality && locality.id || null,
        streetId: street && street.id || null,
        house: house || null,
        apartment: apartment || null
      });

      vm.districtId = district && district.id || null;

      vm.isAddressSearchOpen = false;

    }

    function onAddressSearch() {

      let { addressSearch } = vm;

      if (!_.get(addressSearch, 'length') > 4) {
        vm.matchingAddresses = [];
        return;
      }

      let split = splitAddress(addressSearch);

      // console.warn(addressSearch, split);

      let { street, locality, house, apartment, district } = split;
      let busy = false;

      if (street) {
        busy = findAddressesByStreet(street, locality, house, apartment);
      } else if (locality) {
        busy = findAddressesByLocality(locality, district, house, apartment);
      } else {
        vm.matchingAddresses = [];
        return;
      }

      vm.addressesBusy = busy.then(res => {
        vm.matchingAddresses = res;
        vm.isAddressSearchOpen = true;
        vm.addressesBusy = false;
      });

    }

    function findAddressesByLocality(locality, district, house, apartment) {

      let where = {
        name: { 'like': `%${likeLt(locality)}%` }
      };

      if (district) {
        where['district.name'] = { 'like': `%${likeLt(district)}%` };
      }

      return Locality.findAll({ where }, { limit: 30 })
        .then(res => _.map(res, locality => {

          let { district } = locality;
          return { locality, district, house, apartment };

        }));

    }

    function findAddressesByStreet(street, locality, house, apartment) {

      let where = {
        name: { 'like': `%${likeLt(street)}%` }
      };

      if (locality) {
        where['locality.name'] = { 'like': `%${likeLt(locality)}%` };
      }

      let options = { limit: 30, cacheResponse: false };

      return Street.findAllWithRelations({ where }, options)('Locality')
        .then(res => _.map(res, street => {

          let { locality } = street;
          let { district } = locality;
          return { street, locality, district, house, apartment };

        }));

    }

    const letters = {

      a: 'ą',
      s: 'š',
      e: 'ėę',
      i: 'į',
      u: 'ūų',
      c: 'č',
      z: 'ž'

    };

    function likeLt(string) {
      let res = string;

      _.each(letters, (to, from) => {
        let braced = `[${to}${from}]`;
        res = _.replace(res, new RegExp(braced, 'ig'), braced);
      });

      return res;
    }

    function splitAddress(addressSearch) {

      addressSearch = _.replace(addressSearch, / - /g, '-');

      let parts = _.map(addressSearch.split(','), _.trim);

      let streetIndex = _.findIndex(parts, part => part.match(/[ ](g|pr|tak)([. ]|$)/));

      if (parts.length > 2 && streetIndex === -1) {
        streetIndex = 2;
      }

      let { street, locality, district, house, apartment } = {};

      let streetPart, housePart;

      if (streetIndex >= 0) {

        streetPart = parts[streetIndex];

        if (streetIndex) {
          locality = matchLocality(parts[streetIndex - 1]);
        }

        if (locality && streetIndex >= 2) {
          district = matchDistrict(parts[0]);
        }

      } else if (parts.length === 2) {

        let matchLocalityName = parts[1].match(/(.*) (m|k|km)([. ]|$)(.*)/);

        if (matchLocalityName) {
          locality = matchLocalityName[1];
          housePart = matchLocalityName[4];
          district = matchDistrict(parts[0]);
        } else {
          streetPart = parts[1];
          locality = matchLocality(parts[0]);
        }

      } else if (parts.length === 1) {

        let part = parts[0];

        let matchLocalityName = part.match(/(.*) (m|k|km)([. ]|$)(.*)/);

        if (matchLocalityName) {
          locality = matchLocalityName[1];
          housePart = matchLocalityName[4];
        } else {
          streetPart = part;
        }

      }

      if (streetPart) {
        street = matchStreet(streetPart);
        housePart = matchHousePart(streetPart);
      }

      if (housePart) {
        let houseApt = matchHouseApt(housePart);
        house = houseApt.house;
        apartment = houseApt.apartment;
      }

      return { house, street, locality, district, apartment };

      function matchLocality(string) {
        let match = string.match(/(.*) (m|k|km)(\.|$)/);
        return match ? match[1] : string;
      }

      function matchDistrict(string) {
        return _.first(string.match(/[^ ]*/));
      }

      function matchStreet(string) {

        let houseMatch = string.match(/[ ][0-9]+[a-z]?$/i);

        if (!houseMatch) {
          houseMatch = string.match(/[ ][0-9]+[a-z]?-[0-9]*$/i);
        }

        if (houseMatch) {
          string = _.trim(_.replace(string, houseMatch[0], ''));
        }

        let match = string.match('(.*) (g|pr|tak)([. -]*|$)');

        return match ? match[1] : string;
      }

      function matchHouseApt(string) {

        let apartment = null, house = null;

        let match = _.trim(string).match(/(^[^-]*)([-]|$)([0-9]*)/);

        if (match) {
          house = match[1];
          apartment = match.length > 3 ? match[3] : null;
        }

        return { apartment, house };

      }

      function matchHousePart(string) {

        let res = matchStreet(string);

        if (res) {
          res = _.trim(_.replace(string, res, ''));
          res = _.replace(res, /^(g|pr|tak)[. -]*/i, '');
        }

        return _.trim(res);

      }

    }

    function addressFields() {
      return _.pick(vm.addressee, ['locality.name', 'street.name', 'house', 'apartment']);
    }

    function onChange() {
      vm.addressee.address = concatAddress();
    }

    function concatAddress() {

      let { locality, street, house, apartment } = vm.addressee;

      if (!locality) return null;

      `${locality.name}${street ? ', ' + street.name : ''}${house ? ' ' + house : ''}`;

      return _.filter([
        _.filter([locality.name, street && street.name]).join(', '),
        _.filter([house, apartment]).join('-'),
      ]).join(' ');

    }

  }

})(angular.module('webPage'));
