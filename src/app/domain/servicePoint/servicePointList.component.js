(function (module) {

  module.component('servicePointList', {

    templateUrl: 'app/domain/servicePoint/servicePointList.html',
    controller: servicePointListController,
    controllerAs: 'vm'

  });


  function servicePointListController($scope, Schema, saControllerHelper, $state) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Employee, Person, ServicePoint} = Schema.models();

    vm.use({
      servicePointClick
    });

    vm.rebindAll(ServicePoint, {}, 'vm.data');

    refresh();

    /*
     Functions
     */

    function servicePointClick(servicePoint) {

      $state.go('.detailed', {servicePointId: servicePoint.id});

      // ServicePoint.find(servicePoint.id);

    }

    function refresh() {

      let busy = [
        Person.findAll(),
        Employee.findAll(),
        ServicePoint.findAll()
      ];

      vm.setBusy(busy);

    }


  }


})(angular.module('webPage'));
