'use strict';

(function () {

  angular.module('webPage')
    .service('MapModal', MapModal);

  function MapModal($uibModal) {

    return {open};

    function open(config) {

      let {coords, buttons, title} = config;

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
          zoom: 15,
          coords,
          buttons,
          title
        });

      }
    }

  }

})();