(function (module) {

  module.component('brand', {

    templateUrl: 'app/domain/filterSystem/addFilterSystem/brand/brand.html',
    controller: brandController,
    controllerAs: 'vm'

  });

  function brandController($scope, Schema, saControllerHelper) {

    const vm = saControllerHelper.setup(this, $scope);

    const {Brand} = Schema.models();

    vm.use({
      $onInit,
      save
    });

    Brand.bindAll({
      orderBy: ['name']
    }, $scope, 'vm.brands');

    /*
     Functions
     */

    function save() {

      console.log('fired');
      console.log(vm.brand);
      Brand.create(vm.brand).then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err);
      })
    }

    function $onInit() {

      let busy = [
        Brand.findAll({}, {bypassCache: true})
      ];

      vm.setBusy(busy);

    }

  }

})(angular.module('webPage'));
