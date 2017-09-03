(function (module) {

  module.component('vfsDropdown', {

    bindings: {
      saveTo: '=',
      saveToProperty: '@',
      currentId: '=?ngModel',
      itemsDataSourceName: '@',
      itemsNameProperty: '@',
      itemsGroupProperty: '@',
      filter: '=',
      placement: '@'
    },

    templateUrl: 'app/domain/components/vfsDropdown/vfsDropdown.html',
    controller: dropdownController,
    controllerAs: 'vm'

  });

  function dropdownController($scope, saControllerHelper, Schema, Editing, $timeout, $filter, saEtc) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({
      $onInit,
      itemClick,
      addClick,
      afterCancel,
      afterSave,
      groupLabel,
      onKeyDown
    });

    Editing.setupController(vm, 'newItem');

    vm.watchScope('vm.currentId', onCurrentId);
    vm.watchScope('vm.search', onSearch);
    vm.watchScope('vm.isOpen', onOpen);
    vm.watchScope('vm.filter', onFilter, true);

    /*
     Functions
     */

    function onKeyDown($event) {

      let direction;

      switch ($event.keyCode) {

        case 13: return vm.focused && itemClick(vm.focused);
        case 27: {
          $event.preventDefault();
          return (vm.isOpen = false);
        }
        case 38: {
          direction = 'up';
          break;
        }
        case 40: {
          direction = 'down';
          break;
        }

        default: return;

      }

      let {focused} = vm;

      if (direction ==='down') {
        if (!focused) {
          focused = _.first(vm.filteredData);
        } else {
          let idx = _.findIndex(vm.filteredData, focused);
          if (idx >= vm.filteredData.length - 1) return;
          focused = vm.filteredData[++idx];
        }
      } else if (direction ==='up') {
        if (!focused) {
          focused = _.last(vm.filteredData);
        } else {
          let idx = _.findIndex(vm.filteredData, focused);
          if (!idx) return;
          focused = vm.filteredData[--idx];
        }
      }

      let elem = saEtc.getElementById(focused.id);

      elem.parentElement.parentElement.scrollTop = _.max([0, elem.offsetTop - elem.clientHeight*2]);

      vm.focused = focused;

    }

    function onCurrentId(id) {

      if (!id || !vm.model) {
        vm.currentItem = null;
        return;
      }

      vm.currentItem = vm.model.get(id);

      if (vm.saveToProperty) {
        vm.saveTo[vm.saveToProperty] = id;
      }

    }

    function onFilter() {

      vm.rebindAll(vm.model, vm.filter || {}, 'vm.data', onSearch);

      vm.model.findAll(vm.filter || {}, vm.options || {})
        .then(() => {
          let item = vm.currentId && vm.model.get(vm.currentId);
          vm.currentItem = (item && _.matches(vm.filter)(item)) ? item : null;
          if (!vm.currentItem) {
            vm.currentId = null;
          }
        })
        .then(setDefault);

    }

    function setDefault() {

      if (vm.currentId) {
        return;
      }

      let items = vm.model.filter(vm.filter);

      if (items.length === 1) {
        vm.currentId = _.first(items).id;
      }

    }

    function onOpen(nv, ov) {

      if (ov) {
        $timeout(200).then(() => {
          vm.search = '';
          // delete vm.newItem;
        })
      }

    }

    function groupLabel(item) {
      return _.get(item, vm.itemsGroupProperty);
    }

    function addClick() {

      vm.newItem = vm.model.createInstance(_.assign({name: vm.search}, vm.filter || {}));
      vm.isOpen = false;

    }

    function $onInit() {

      let model = Schema.model(vm.itemsDataSourceName);

      vm.use({
        model,
        itemsNameProperty: vm.itemsNameProperty || 'name',
        editComponentName: 'edit-' + _.kebabCase(vm.itemsDataSourceName),
        currentId: vm.currentId || vm.saveTo && vm.saveToProperty && vm.saveTo[vm.saveToProperty],
        newItemTitle: _.get(model, 'meta.label.add') || 'Naujas įrašas'
      });

      onFilter();

    }

    function onSearch() {

      let {search} = vm;

      vm.filteredData = !search ? vm.data : $filter('filter')(vm.data, search);

      vm.filteredData = $filter('orderBy')(vm.filteredData, vm.itemsNameProperty);

    }

    function itemClick(item) {

      vm.use({
        currentId: item.id,
        currentItem: item,
        isOpen: false
      });

    }

    function afterCancel($event) {
      $event.stopPropagation();
      delete vm.newItem;
    }

    function afterSave(saved) {

      //vm.currentItem = saved;
      vm.currentId = saved.id;
      vm.isOpen = false;
      delete vm.newItem;

    }

  }

})(angular.module('webPage'));
