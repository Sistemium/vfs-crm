(function (module) {

  module.component('editServicePoint', {

    bindings: {
      servicePoint: '=ngModel',
      saveFn: '=',
      readyState: '='
    },

    templateUrl: 'app/domain/servicePoint/editServicePoint/editServicePoint.html',
    controller: editServicePointController,
    controllerAs: 'vm'

  });

  function editServicePointController(saControllerHelper, $scope, ReadyStateHelper, Schema) {

    const {Site, Street, District} = Schema.models();

    const vm = ReadyStateHelper.setupController(this, $scope, 'servicePoint');

    vm.use({
      $onInit,
      onAddressSearchKeyPress,
      applyAddress,
      newItem: {}
    });


    /*
    Functions
     */

    function $onInit() {

      let {servicePoint} = vm;

      if (servicePoint && !servicePoint.id) {
        servicePoint.siteId = _.get(Site.meta.getCurrent(), 'id');
      }

      District.findAll();

      servicePoint && servicePoint.DSLoadRelations(['Street', 'Locality'])
        .then(() => servicePoint.locality && servicePoint.locality.DSLoadRelations())
        .then(() => {
          vm.use({
            districtId: _.get(servicePoint, 'locality.districtId')
          });
          vm.watchScope(addressFields, onChange, true);
          vm.ready = true;
        });

      vm.watchScope('vm.addressSearch', onAddressSearch);

    }

    function onAddressSearchKeyPress($event) {

      let {keyCode} = $event;

      if (keyCode === 13 && vm.matchingAddresses.length === 1) {
        return applyAddress(vm.matchingAddresses[0]);
      }

      if (_.includes([13, 40], keyCode)) {
        vm.isAddressSearchOpen = true;
      }
    }

    function applyAddress(address) {

      let {street, locality, district, house, apartment} = address;

      _.assign(vm.servicePoint, {
        localityId: locality && locality.id || null,
        streetId: street && street.id || null,
        house: house || null,
        apartment: apartment || null
      });

      vm.districtId = district && district.id || null;

      vm.isAddressSearchOpen = false;

    }

    function onAddressSearch() {

      let {addressSearch} = vm;

      if (!addressSearch) {
        vm.matchingAddresses = [];
        return;
      }

      let split = splitAddress(addressSearch);

      console.warn(addressSearch, split);

      let {street, locality, house, apartment} = split;

      if (street) {

        vm.isAddressSearchOpen = true;

        let where = {
          name: {'like': `%${likeLt(street)}%`}
        };

        return Street.findAllWithRelations({where}, {limit: 30})('Locality')
          .then(res => _.map(res, street => {

            let {locality} = street;
            let {district} = locality;
            return {street, locality, district, house, apartment};

          }))
          .then(addresses => {

            if (locality) {
              let re = new RegExp(likeLt(locality), 'i');
              return _.filter(addresses, address => address.locality.name.match(re));
            }

            return addresses;

          })
          .then(res => vm.matchingAddresses = res);

      }

      vm.matchingAddresses = [];

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

      let parts = _.map(addressSearch.split(','), _.trim);

      let streetIndex = _.findIndex(parts, part => part.match(/[ ](g|pr|tak)([. ]|$)/));

      if (parts.length > 2 && streetIndex === -1) {
        streetIndex = 2;
      }

      let {street, locality, district, house, apartment} = {};

      let streetPart = false;

      if (streetIndex >= 0) {

        streetPart = parts[streetIndex];

        if (streetIndex) {
          locality = matchLocality(parts[streetIndex - 1]);
        }

        if (locality && streetIndex >= 2) {
          district = matchDistrict(parts[0]);
        }

      } else if (parts.length === 2) {
        locality = matchLocality(parts[1]);
        district = matchDistrict(parts[0]);
      } else if (parts.length === 1) {
        streetPart = parts[0];
      }

      if (streetPart) {

        street = matchStreet(streetPart);
        let housePart = matchHousePart(streetPart);

        if (housePart) {
          let houseApt = matchHouseApt(housePart);
          house = houseApt.house;
          apartment = houseApt.apartment;
        }

      }

      return {house, street, locality, district, apartment};

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

        let match = string.match(/(^[^-]*)([-]|$)([0-9]*)/);

        if (match) {
          house = match[1];
          apartment = match.length > 3 ? match[3] : null;
        }

        return {apartment, house};

      }

      function matchHousePart(string) {

        let street = matchStreet(string);

        if (street) {
          street = _.trim(_.replace(string, street, ''));
          street = _.replace(street, /^(g|pr|tak)[. -]*/i, '');
        }

        return street;

      }

    }

    function addressFields() {
      return _.pick(vm.servicePoint, ['localityId', 'streetId', 'house']);
    }

    function onChange() {
      if (!vm.servicePoint) return;
      vm.servicePoint.address = vm.servicePoint.concatAddress();
    }

  }

})(angular.module('webPage'));
