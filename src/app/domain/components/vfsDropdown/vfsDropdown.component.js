(function (module) {

  module.component('vfsDropdown', {

    bindings: {
      current: '=',
      currentModel: '=',
      modelName: '@',
      destination: '@',
      idToRewrite: '@',
      autoSave: '='
    },
    templateUrl: 'app/domain/components/vfsDropdown/vfsDropdown.html',
    controller: dropdownController,
    controllerAs: 'vm'

  });

  function dropdownController($scope, saControllerHelper, Schema, toastr) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit,
      itemClick
    });

    /*
     Functions
     */

    $scope.$watch('vm.isOpen', (nv, ov) => {

      if (nv !== ov) {
        vm.search = '';
      }

    });

    function $onInit() {

      let model = Schema.model(vm.modelName);

      model.findAll()
        .then((data) => {
          vm.data = data;
        });

    }

    function itemClick(item) {

      vm.currentModel[vm.idToRewrite] = item.id;

      if (!vm.autoSave) {
        vm.isOpen = false;
        return;
      }

      vm.currentModel.DSCreate(vm.currentModel)
        .then(() => {
          // toastr.success('Pakeitimai išsaugoti');
        })
        .catch(() => {
          toastr.error('Klaida. Pakeitimai neišsaugoti');
        })
        .finally(() => {
          vm.isOpen = false;
        });

    }

  }

})(angular.module('webPage'));
