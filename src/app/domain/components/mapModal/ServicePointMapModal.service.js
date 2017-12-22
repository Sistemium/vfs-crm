'use strict';

(function () {

  angular.module('webPage')
    .service('ServicePointMapModal', ServicePointMapModal);

  function ServicePointMapModal(MapModal, Schema, NgMap, $rootScope) {

    const {Location} = Schema.models();

    return {open};

    function open(config) {

      let {servicePoint} = config;

      _.assign(config, {

        title: servicePoint.address,

        buttons: {
          saveButton: {
            title: 'Išsaugoti koordinates',
            onClick: saveCoordsClick,
            class: 'btn-success'
          },
          changeButton: {
            title: 'Keisti koordinates',
            onClick: changeCoordsClick,
            class: 'btn-info-modified'
          },
          revertButton: {
            title: 'Atšaukti keitimą',
            onClick: revertCoordsClick,
            class: 'btn-danger'
          }
        }

      });

      return MapModal.open(config);

      function changeCoordsClick(vm) {
        vm.marker.isDraggable = true;

        vm.coordsCopy = null;
        vm.coordsCopy = _.clone(vm.marker.coords);

        vm.toggleButton('btn-info-modified', false);
        vm.toggleButton('btn-success', true);
        vm.toggleButton('btn-danger', true);
      }

      function revertCoordsClick(vm) {

        NgMap.getMap('largeMap')
          .then((map) => {

            if (vm.defaultCoords.lat === vm.coordsCopy.lat && vm.defaultCoords.lng === vm.coordsCopy.lng) {
              vm.zoom = 7;
            } else {
              vm.zoom = 15;
            }

            map.setCenter(vm.coordsCopy);
            vm.marker.coords = vm.coordsCopy;
            vm.marker.isDraggable = false;

            vm.inputAddress = null;
            vm.coordsCopy = null;

            vm.toggleButton('btn-success', false);
            vm.toggleButton('btn-danger', false);
            vm.toggleButton('btn-info-modified', true);

          })
          .catch((err) => {
            console.error(err);
          });
      }

      function saveCoordsClick(vm) {

        let locationData = {
          longitude: vm.marker.coords.lng,
          latitude: vm.marker.coords.lat,
          altitude: 0,
          source: 'User',
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

            $rootScope.$broadcast('onLocationChange');

            vm.marker.isDraggable = false;
            vm.inputAddress = null;
            vm.coordsCopy = null;
            vm.noGeoPosition = false;

            vm.toggleButton('btn-success', false);
            vm.toggleButton('btn-danger', false);
            vm.toggleButton('btn-info-modified', true);

          });

      }

    }

  }

})();