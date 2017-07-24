(function (module) {

  module.component('vfsDropdown', {

    bindings: {
      current: '=',
      currentModel: '=',
      modelName: '@',
      destination: '@',
      idToRewrite: '@'
    },
    templateUrl: 'app/domain/components/vfsDropdown/vfsDropdown.html',
    controller: dropdownController,
    controllerAs: 'vm'

  });

  function dropdownController($scope, saControllerHelper, Schema, toastr) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit,
      onInputClick,
      save
    });

    /*
     Functions
     */

    $scope.$watch('vm.isOpen', (nv, ov) => {

      if (nv !== ov) {
        vm.search = '';
      }

    });

    function onInputClick(ev) {
      ev.stopPropagation();
    }

    function $onInit() {

      let model = Schema.model(vm.modelName);

      model.findAll()
        .then((data) => {
          vm.data = data;
        });

    }

    function save(item) {

      vm.currentModel[vm.idToRewrite] = item.id;

      vm.currentModel.DSCreate(vm.currentModel)
        .then(() => {
          toastr.success('Pakeitimai išsaugoti');
        })
        .catch(() => {
          toastr.success('Klaida. Pakeitimai neišsaugoti');
        });

    }

  }

})(angular.module('webPage'));
