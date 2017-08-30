'use strict';

(function () {

  angular.module('webPage')
    .service('OnMap', OnMap);

  function OnMap($uibModal) {

    return {open};

    function open(servicePoint, coords) {

      let modalInstance = $uibModal.open({
        animation: false,
        template: `       
         
        <div class="modal-header" style="padding: 0 15px">
          <h3 style="margin-top: 10px">{{vm.servicePoint.address}}</h3>
        </div>
        
        <div class="modal-body" id="modal-body">
          <div resize resize-offset-top="115" resize-property="height">
            <ng-map
            ng-if="vm.isReady" 
            style="height: inherit;"
            center='[{{vm.coords.lat()}}, {{vm.coords.lng()}}]'
            zoom="13"
          >
            <marker 
              position="{{vm.coords.lat()}}, {{vm.coords.lng()}}"
              animation="DROP"
              draggable="true">      
            </marker>
          </ng-map>   
          </div>   
            
        </div>
        <div class="modal-footer">
          <button class="btn btn-success save" ng-click="vm.saveCoordsClick()">Išsaugoti koordinates</button>
        </div>`,

        size: 'lg',

        controller

      });

      modalInstance.result
        .then(() => {
        }, () => {
        });

      function controller($scope, Schema) {

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