(function (module) {

  module.component('filterSystem', {

    templateUrl: 'app/domain/filterSystem/filterSystem.html',
    controller: filterSystemController,
    controllerAs: 'vm'

  });

  function filterSystemController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Brand, FilterSystemType} = Schema.models();

    vm.use({$onInit});

    Brand.bindAll({}, $scope, 'vm.brands');

    /*
     Functions
     */

    function $onInit() {

      let busy = [
        FilterSystemType.findAll(),
        Brand.findAllWithRelations({}, {bypassCache: true})(['FilterSystem'])
      ];

      vm.setBusy(busy);

    }

  }

})(angular.module('webPage'));
