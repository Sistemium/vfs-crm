'use strict';

(function () {

  angular.module('webPage')
    .service('ServicePointMapModal', ServicePointMapModal);

  function ServicePointMapModal(MapModal, Schema) {

    const {Location} = Schema.models();

    return {open};

    function open(config) {

      let {servicePoint} = config;

      let buttons = [{
        title: 'Išsaugoti koordinates',
        onClick: saveCoordsClick
      }];

      _.assign(config, {buttons});

      return MapModal.open(config);

      function saveCoordsClick(vm) {

        Location.create({
          longitude: vm.coords.lng(),
          latitude: vm.coords.lat(),
          altitude: 0,
          source: 'user',
          ownerXid: servicePoint.id,
          timestamp: new Date()
        })
          .then(savedLocation => {
            servicePoint.locationId = savedLocation.id;
            servicePoint.DSCreate();
          });

      }

    }

  }

})();