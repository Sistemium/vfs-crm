(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });


  function servicePointDetailsController($scope, Schema, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    const {ServicePoint} = Schema.models();

    vm.use({
    });

    refresh();

    /*
     Functions
     */

    function refresh() {

      let id = $state.params.servicePointId;

      let busy = [
        ServicePoint.find(id)
      ];

      vm.setBusy(busy)
        .then(res => {
          vm.servicePoint = res;
        });

    }


  }


})(angular.module('webPage'));
