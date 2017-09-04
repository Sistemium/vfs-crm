'use strict';

(function () {

  angular.module('webPage')
    .service('MapModal', MapModal);

  function MapModal($uibModal) {

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
          });

        $scope.vm = vm;

        _.assign(vm, {

          // TODO: save zoom to localStorage and restore

          zoom: zoom || 15,
          buttons,
          mapCenter: coords,
          title,

          marker: {
            coords,
            isDraggable: noGeo
          },

          closeModal,
          onDragEnd

        });

        function closeModal() {
          modalInstance.close();
        }

        function onDragEnd(ev) {

          vm.marker.coords.lat = ev.latLng.lat();
          vm.marker.coords.lng = ev.latLng.lng();

        }

      }
    }

  }

})();