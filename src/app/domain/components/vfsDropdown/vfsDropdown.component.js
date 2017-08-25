(function (module) {

  module.component('vfsDropdown', {

    bindings: {
      saveTo: '=',
      saveToProperty: '@',
      itemsDataSourceName: '@',
      itemsNameProperty: '@',
      itemsGroupProperty: '@',
      autoSave: '=',
      filter: '=',
      placement: '@'
    },

    templateUrl: 'app/domain/components/vfsDropdown/vfsDropdown.html',
    controller: dropdownController,
    controllerAs: 'vm'

  });

  function dropdownController($scope, saControllerHelper, Schema, toastr, Editing, $timeout, $filter) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit,
      itemClick,
      addItem,
      afterCancel,
      afterSave,
      groupLabel
    });

    Editing.setupController(vm, 'newItem');

    vm.watchScope('vm.search', onSearch);
    vm.watchScope('vm.isOpen', onOpen);
    vm.watchScope('vm.filter', onFilter, true);

    /*
     Functions
     */

    function onFilter() {

      vm.rebindAll(vm.model, vm.filter || {}, 'vm.data', onSearch);

      vm.model.findAll(vm.filter || {}, vm.options || {})
        .then(data => {
          vm.currentItem = _.find(data, {id: vm.currentId});
        });

    }

    function onOpen(nv, ov) {

      if (ov) {
        $timeout(200).then(() => {
          vm.search = '';
          delete vm.newItem;
        })
      }

    }

    function groupLabel(item) {
      return _.get(item, vm.itemsGroupProperty);
    }

    function addItem() {

      vm.newItem = vm.model.createInstance({name: vm.search});

    }

    function $onInit() {

      vm.editComponentName = 'edit-' + _.kebabCase(vm.itemsDataSourceName);

      vm.currentId = vm.saveTo[vm.saveToProperty];

      let model = Schema.model(vm.itemsDataSourceName);

      vm.model = model;
      vm.newItemTitle = _.get(model, 'meta.label.add') || 'Naujas įrašas';

      onFilter();

    }

    function onSearch() {

      let {search} = vm;

      vm.filteredData = !search ? vm.data : $filter('filter')(vm.data, search);

      vm.filteredData = $filter('orderBy')(vm.filteredData, vm.itemsNameProperty);

    }

    function itemClick(item) {

      vm.currentItem = item;
      vm.saveTo[vm.saveToProperty] = item.id;

      if (!vm.autoSave) {
        vm.isOpen = false;
        return;
      }

      vm.saveTo.DSCreate()
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

    function afterSave(saved) {

      vm.currentItem = saved;
      vm.saveTo[vm.saveToProperty] = saved.id;
      vm.isOpen = false;

    }

  }

})(angular.module('webPage'));
