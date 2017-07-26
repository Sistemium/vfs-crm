(function (module) {

  module.component('vfsDropdown', {

    bindings: {
      saveTo: '=',
      saveToProperty: '@',
      itemsDataSourceName: '@',
      itemsNameProperty: '@',
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

      vm.currentId = vm.saveTo[vm.saveToProperty];

      let model = Schema.model(vm.itemsDataSourceName);

      model.bindAll({}, $scope, 'vm.data');

      model.findAll()
      .then(data => {
        vm.currentItem = _.find(data, {id: vm.currentId});
      });

    }

    function itemClick(item) {

      vm.currentItem = item;
      vm.saveTo[vm.saveToProperty] = item.id;

      if (!vm.autoSave) {
        vm.isOpen = false;
        return;
      }

      vm.currentModel.DSCreate(vm.saveTo)
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
