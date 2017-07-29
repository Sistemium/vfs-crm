(function (module) {

  module.component('vfsDropdown', {

    bindings: {
      saveTo: '=',
      saveToProperty: '@',
      itemsDataSourceName: '@',
      itemsNameProperty: '@',
      autoSave: '=',
      placement: '@'
    },

    templateUrl: 'app/domain/components/vfsDropdown/vfsDropdown.html',
    controller: dropdownController,
    controllerAs: 'vm'

  });

  function dropdownController($scope, saControllerHelper, Schema, toastr, Editing, $timeout) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit,
      itemClick,
      addItem,
      afterCancel,
      afterSave
    });

    Editing.setupController(vm, 'newItem');

    /*
     Functions
     */

    $scope.$watch('vm.isOpen', (nv, ov) => {

      if (nv !== ov) {
        $timeout(200).then(()=>{
          vm.search = '';
          delete vm.newItem;
        })
      }

    });

    function addItem() {

      vm.newItem = vm.model.createInstance({name: vm.search});

    }

    function $onInit() {

      vm.editComponentName = 'edit-' + _.kebabCase(vm.itemsDataSourceName);

      vm.currentId = vm.saveTo[vm.saveToProperty];

      let model = Schema.model(vm.itemsDataSourceName);
      vm.model = model;

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

    function afterCancel($event) {
      $event.stopPropagation();
      delete vm.newItem;
    }

    function afterSave() {

      vm.currentItem = vm.newItem;
      vm.saveTo[vm.saveToProperty] = vm.newItem.id;
      vm.isOpen = false;

    }

  }

})(angular.module('webPage'));
