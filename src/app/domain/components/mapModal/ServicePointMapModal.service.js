'use strict';

(function () {

  angular.module('webPage')
    .service('ServicePointMapModal', ServicePointMapModal);

  function ServicePointMapModal(MapModal, Schema, NgMap) {

    const {Location} = Schema.models();

    return {open};

    function open(config) {

      let {servicePoint} = config;

      let buttons = [];

      const saveButton = {
        title: 'Išsaugoti koordinates',
        onClick: saveCoordsClick,
        class: 'btn-success'
      };

      const changeButton = {
        title: 'Keisti koordinates',
        onClick: changeCoordsClick,
        class: 'btn-info'
      };

      const revertButton = {
        title: 'Atšaukti keitimą',
        onClick: revertCoordsClick,
        class: 'btn-danger'
      };

      console.warn(servicePoint);

      if (servicePoint.locationId) {
        buttons.push(changeButton);
      } else {
        buttons.push(saveButton);
      }

      _.assign(config, {
        buttons,
        title: servicePoint.address
      });

      return MapModal.open(config);

      function changeCoordsClick(vm) {
        vm.marker.isDraggable = true;
        _.remove(buttons, changeButton);
        buttons.push(revertButton);
        buttons.push(saveButton);
      }

      function revertCoordsClick(vm) {

        NgMap.getMap('largeMap')
          .then(map => {

            map.setCenter(vm.mapCenter);
            vm.marker.coords = vm.mapCenter;
            vm.marker.isDraggable = false;

            _.remove(buttons, revertButton);
            _.remove(buttons, saveButton);
            buttons.push(changeButton);

          });

      }

      function saveCoordsClick(vm) {

        let locationData = {
          longitude: vm.marker.coords.lng(),
          latitude: vm.marker.coords.lat(),
          altitude: 0,
          source: 'user',
          ownerXid: servicePoint.id,
          timestamp: new Date()
        };

        if (servicePoint.locationId) {
          locationData.id = servicePoint.locationId;
        }

        Location.create(locationData)
          .then(savedLocation => {
            servicePoint.locationId = savedLocation.id;
            servicePoint.DSCreate();

            _.remove(buttons, revertButton);
            _.remove(buttons, saveButton);
            buttons.push(changeButton);

          });

      }

    }

  }

})();