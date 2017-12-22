'use strict';

(function () {

  angular.module('webPage')
    .service('MapModal', MapModal);

  function MapModal($uibModal, NgMap, GeoCoder, toastr) {

    return {open};

    function open(config) {

      let {coords, buttons, title, zoom, noGeo} = config;

      let modalInstance = $uibModal.open({

        animation: false,
        templateUrl: 'app/domain/components/mapModal/mapModal.html',

        size: 'lg',

        controller: mapModalController

      });

      return modalInstance;

      function mapModalController($scope) {

        const vm = {};

        modalInstance.rendered
          .then(() => {
            vm.isReady = true;
            vm.defineButtons();
          });

        $scope.vm = vm;

        _.assign(vm, {

          zoom: zoom || 15,
          buttons,
          title,
          mapCenter: coords,
          searchingAddress: null,
          coordsCopy: null,
          defaultCoords: {lng: 23.897, lat: 55.322},

          marker: {
            coords,
            isDraggable: noGeo || false
          },

          closeModal,
          onDragEnd,
          placeChanged,
          disableTap,
          toggleButton,
          defineButtons

        });

        function defineButtons() {

          if (coords) {
            toggleButton('btn-info-modified', true);
          } else {
            toggleButton('btn-success', true);
          }

        }

        function disableTap() {
          let input = event.target;

          let container = document.getElementsByClassName('pac-container');
          container = angular.element(container);
          container.css('z-index', '5000');
          container.css('pointer-events', 'auto');

          container.on('click', function () {
            input.blur();
          });
        }

        function closeModal() {
          delete vm.inputAddress;
          modalInstance.close();
        }

        function toggleButton(btnClass, state) {
          let button = _.find(vm.buttons, ['class', btnClass]);
          button.showButton = state;
        }

        function placeChanged() {

          let place = this.getPlace();

          if (!place.place_id) {

            GeoCoder.geocode({'address': vm.inputAddress})
              .then(result => {
                applyMarkerPosition(result[0]);
              })
              .catch(() => {
                toastr.error('Adreso koordinatės nerastos');
              });
          } else {
            applyMarkerPosition(place);
          }

        }

        function applyMarkerPosition(place) {

          NgMap.getMap('largeMap')
            .then(map => {

              vm.zoom = 15;

              if (!vm.coordsCopy)
                vm.coordsCopy = _.clone(vm.marker.coords);

              map.setCenter(place.geometry.location);
              vm.marker.coords.lat = place.geometry.location.lat();
              vm.marker.coords.lng = place.geometry.location.lng();
              vm.marker.isDraggable = true;

              toggleButton('btn-success', true);
              toggleButton('btn-danger', true);
              toggleButton('btn-info-modified', false);

            })
        }

        function onDragEnd(ev) {

          vm.marker.coords.lat = ev.latLng.lat();
          vm.marker.coords.lng = ev.latLng.lng();

        }

      }
    }

  }

})();