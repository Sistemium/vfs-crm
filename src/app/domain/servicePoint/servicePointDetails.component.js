(function (module) {

  module.component('servicePointDetails', {

    templateUrl: 'app/domain/servicePoint/servicePointDetails.html',
    controller: servicePointDetailsController,
    controllerAs: 'vm'

  });


  function servicePointDetailsController($scope, Schema, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    const {ServicePoint, FilterSystem, Brand} = Schema.models();

    vm.use({});

    refresh();

    FilterSystem.findAll();
    Brand.findAll();

    /*
     Functions
     */

    function refresh() {

      let id = $state.params.servicePointId;

      let busy = [
        ServicePoint.find(id),
        ServicePoint.findAllWithRelations({id}, {bypassCache: true})(['ServiceItem'])
      ];

      vm.setBusy(busy)
        .then(res => {
          vm.servicePoint = res[0];
          console.warn(res[0]);
        });

    }


  }


})(angular.module('webPage'));
