(function (module) {

  module.component('vfsDropdown', {

    bindings: {
      current: '=',
      currentModel: '=',
      modelName: '@',
      destination: '@',
      idToRewrite: '@',
      id: '@'
    },
    templateUrl: 'app/domain/components/vfsDropdown/vfsDropdown.html',
    controller: dropdownController,
    controllerAs: 'vm'

  });

  function dropdownController($scope, saControllerHelper, Schema, toastr) {

    const vm = saControllerHelper.setup(this, $scope);

    const {ServiceItem} = Schema.models();

    vm.use({
      $onInit,
      save
    });

    /*
     Functions
     */

    function $onInit() {
      let model = Schema.model(vm.modelName);
      model.findAll().then((data) => {
        vm.data = data;
      });
    }

    function save(item) {

      vm.currentModel[vm.idToRewrite] = item.id;

      ServiceItem.create(vm.currentModel).then(() => {
        toastr.success('Pakeitimai išsaugoti');
      })
      .catch(() => {
        toastr.success('Klaida. Pakeitimai neišsaugoti');
      });

    }

  }

})(angular.module('webPage'));
