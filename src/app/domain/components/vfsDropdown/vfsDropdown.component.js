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

  function dropdownController($scope, saControllerHelper, Schema, Editing, $timeout, $filter, saEtc, UUID) {

    const vm = saControllerHelper.setup(this, $scope);

    vm.use({

      id: `vfs-dropdown-${UUID.v4()}`,

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

        case 13:
          return vm.focused && itemClick(vm.focused);
        case 27: {
          $event.preventDefault();
          return (vm.isOpen = false);
        }
        case 38: {
          direction = -1;
          break;
        }
        case 40: {
          direction = 1;
          break;
        }

        default:
          return;

      }

      let {focused} = vm;

      if (!focused) {
        focused = vm.currentItem;
      }

      if (!saEtc.getElementById(focused.id)) {
        focused = false;
      }

      if (!focused) {
        focused = getFirstVisibleElement();
      }

      if (!focused) return;

      if (direction === 1) {
        let idx = _.findIndex(vm.filteredData, focused);
        if (idx >= vm.filteredData.length - 1) return;
        focused = vm.filteredData[++idx];
      } else if (direction === -1) {
        let idx = _.findIndex(vm.filteredData, focused);
        if (idx < 0) return;
        focused = vm.filteredData[--idx] || focused;
      }

      scrollToExistingElement(focused);

      vm.focused = focused;

    }

    function getFirstVisibleElement() {

      let scroller = saEtc.getElementById(vm.id);

      return _.find(vm.filteredData, {id: scroller.children[1].getAttribute('id')});

    }

    function scrollToExistingElement(focused) {
      let elem = saEtc.getElementById(focused.id);
      let scroller = elem.parentElement;

      let innerPosition = elem.offsetTop - scroller.scrollTop;
      let minPosition = elem.clientHeight * 3;
      let maxPosition = scroller.clientHeight - elem.clientHeight * 2;

      if (innerPosition < minPosition) {
        scroller.scrollTop = _.max([0, elem.offsetTop - minPosition]);
      } else if (innerPosition > maxPosition) {
        scroller.scrollTop = elem.offsetTop + minPosition - scroller.clientHeight;
      }
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

    const itemHeight = 34;

    function scrollToCurrent() {

      if (!vm.currentId) {
        return;
      }

      let elem = saEtc.getElementById(vm.currentId);

      if (!elem) {

        let scroller = saEtc.getElementById(vm.id);

        if (!scroller) {
          return $timeout(200)
            .then(scrollToCurrent);
        }

        let idx = _.findIndex(vm.filteredData, vm.currentItem);

        scroller.scrollTop = (idx + 1) * itemHeight;

        return $timeout(200)
          .then(scrollToCurrent);

      }

      scrollToExistingElement(elem);

    }

    function onOpen(nv, ov) {

      if (ov) {
        $timeout(200).then(() => {
          vm.search = '';
          delete vm.focused;
        })
      }

      if (nv) {
        scrollToCurrent();
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
