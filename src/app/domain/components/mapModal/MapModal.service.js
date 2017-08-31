'use strict';

(function () {

  angular.module('webPage')
    .service('MapModal', MapModal);

  function MapModal($uibModal) {

    return {open};

    function open(servicePoint, coords) {

      let modalInstance = $uibModal.open({
        animation: false,
        templateUrl: 'app/domain/components/mapModal/mapModal.html',

        size: 'lg',

        controller: mapModalController

      });

      return modalInstance;

      function mapModalController($scope, Schema) {

        const vm = {saveCoordsClick};

        const {Location} = Schema.models();

        modalInstance.rendered
          .then(() => {
            vm.isReady = true;
          });

        $scope.vm = vm;

        vm.servicePoint = servicePoint;
        vm.coords = coords;

        function saveCoordsClick() {
          Location.create({
            longitude: vm.coords.lng(),
            latitude: vm.coords.lat(),
            altitude: 0,
            source: vm.servicePoint.id,
            timestamp: new Date()
          }).then((savedLocation) => {
            vm.servicePoint.locationId = savedLocation.id;
            vm.servicePoint.DSCreate();
          });

        }

      }
    }

  }

})();