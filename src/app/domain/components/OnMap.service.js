'use strict';

(function () {

  angular.module('webPage')
    .service('OnMap', OnMap);

  function OnMap($uibModal) {

    return {open, setupController};

    function setupController(vm) {

      _.assign(vm, {});

      /*
       Functions
       */

    }

    function open(servicePoint, coords) {

      console.log(servicePoint, coords);

      let modalInstance = $uibModal.open({
        animation: true,
        template: `       
         
        <div class="modal-header" style="padding: 0 15px">
          <h3 style="margin-top: 10px">{{vm.servicePoint.address}}</h3>
        </div>
        
        <div class="modal-body" id="modal-body" resize resize-offset-top="190" resize-property="height">
          <ng-map
          ng-if="vm.isReady"
          style="height: 70%"
          center='[{{vm.coords.lat()}}, {{vm.coords.lng()}}]'
          zoom="13"
          >
            <marker 
              position="{{vm.coords.lat()}}, {{vm.coords.lng()}}"
              animation="DROP"
              draggable="true">      
            </marker>
          </ng-map>   
        </div>`,

        size: 'lg',

        controller

      });

      modalInstance.result
        .then(() => {
        }, () => {
        });

      function controller($scope) {

        const vm = {};

        modalInstance.rendered
          .then(() => {
            vm.isReady = true;
          });

        $scope.vm = vm;

        vm.servicePoint = servicePoint;
        vm.coords = coords;

      }
    }

  }

})();