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
      placement: '@',
      readyState: '=?',
      autoNew: '@'
    },

    templateUrl: 'app/domain/components/vfsDropdown/vfsDropdown.html',
    controller: dropdownController,
    controllerAs: 'vm'

  });

  function dropdownController($scope, saControllerHelper, Schema, Editing, $timeout, $filter, saEtc, UUID) {

    let vm = saControllerHelper.setup(this, $scope);

    vm.use({

      id: `vfs-dropdown-${vm.itemsDataSourceName}-${UUID.v4()}`,
      inputId: `vfs-dropdown-input-${UUID.v4()}`,

      $onInit,
      $onDestroy,
      itemClick,
      inputClick,
      addClick,
      editClick,
      afterCancel,
      afterSave,
      groupLabel,
      onKeyDown,
      onInputFocus,
      onInputBlur,
      saveByUserClick,

      isOpen: false,
      isOpened: false,
      inputFocused: false,
      ownReadyState: {}

    });

    let inputFocused = false;
    let enterClicked = false;
    let unwatchSearch = _.noop;
    let unwatchNewItem = _.noop;

    Editing.setupController(vm, 'newItem');

    vm.watchScope('vm.currentId', onCurrentId);
    vm.watchScope('vm.isOpen', onOpen);
    vm.watchScope('vm.filter', onFilter, true);
    $scope.$watch('vm.newItem', onNewItem);

    /*
     Functions
     */

    function $onInit() {

      vm.isOpened = 'true';

      let model = Schema.model(vm.itemsDataSourceName);

      vm.use({
        model,
        itemsNameProperty: vm.itemsNameProperty || 'name',
        editComponentName: 'edit-' + _.kebabCase(vm.itemsDataSourceName),
        currentId: vm.currentId || vm.saveTo && vm.saveToProperty && vm.saveTo[vm.saveToProperty],
        newItemTitle: _.get(model, 'meta.label.add') || 'Naujas įrašas',
        readyState: vm.readyState || {}
      });

      vm.readyState.save = vm.saveClick;

      onFilter();

      if (vm.autoNew && !vm.currentId) {
        addClick();
      }

    }

    function saveByUserClick() {

      let saveFn = vm.saveFn || vm.newItem.DSCreate;

      if (vm.newItem.id && !vm.newItem.DSHasChanges()) {
        delete vm.newItem;
        return;
      }

      saveFn.call(vm.newItem)
        .then((res) => {
          vm.dropdownInput = res.name;
          vm.afterSave(res);
        })

    }

    function $onDestroy() {
      vm.readyState = {};
    }

    function inputClick() {
      vm.isOpen = !vm.isOpen;
    }

    function onNewItem() {

      if (!vm.readyState) return;

      if (vm.newItem) {
        unwatchNewItem = $scope.$watch(() => vm.newItem && vm.newItem.isValid(vm.readyState), onNewItemIsValid);
      } else {
        vm.readyState = {};
        unwatchNewItem();
      }

    }

    function onNewItemIsValid(isValid) {

      let isValidBoolean = !!isValid;

      vm.readyState.ready = isValidBoolean;
      vm.readyState.save = isValidBoolean ? vm.saveClick : _.noop

    }

    function onInputFocus() {
      inputFocused = true;
      vm.dropdownInput = vm.dropdownInputCopy;
    }

    function onInputBlur() {

      inputFocused = false;

      if (!enterClicked) {
        vm.dropdownInputCopy = vm.dropdownInput;
      }

      if (vm.currentItem) {
        vm.dropdownInput = vm.currentItem[vm.itemsNameProperty];
      }

      enterClicked = false;

    }

    function onKeyDown($event) {

      let direction;

      if (!vm.isOpen)
        return;

      switch ($event.keyCode) {

        case 13:
          return vm.focused && itemClick(vm.focused, true);
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

      if (focused && !saEtc.getElementById(focused.id)) {
        focused = false;
      }

      if (!focused) {

        focused = getFirstVisibleElement();

      } else if (direction === 1) {

        let idx = _.findIndex(vm.filteredData, focused);
        if (idx >= vm.filteredData.length - 1) return;
        focused = vm.filteredData[++idx];

      } else if (direction === -1) {

        let idx = _.findIndex(vm.filteredData, focused);
        if (idx < 0) return;
        focused = vm.filteredData[--idx] || focused;

      }

      if (!focused) return;

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
      vm.dropdownInput = vm.currentItem.name;

      if (vm.saveToProperty) {
        vm.saveTo[vm.saveToProperty] = id;
      }

    }

    function onFilter() {

      vm.rebindAll(vm.model, vm.filter || {}, 'vm.data', onSearch);

      _.assign(vm.newItem, vm.filter);

      if (_.filter(vm.filter, val => _.isUndefined(val) || val === null).length) {
        return setCurrentData();
      }

      vm.model.findAll(vm.filter || {}, vm.options || {})
        .then(setCurrentData)
        .then(setDefault);

    }

    function setCurrentData() {

      let item = vm.currentId && vm.model.get(vm.currentId);

      vm.currentItem = (item && _.matches(vm.filter)(item)) ? item : null;

      if (vm.currentItem) {
        vm.dropdownInput = vm.currentItem[vm.itemsNameProperty];
      } else {
        vm.currentId = null;
        vm.dropdownInput = null;
      }

    }

    function setDefault() {

      if (vm.currentId || vm.model.meta.noDefault) {
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

        unwatchSearch();

        $timeout(200).then(() => {
          delete vm.focused;
        })

      }

      if (nv) {

        scrollToCurrent();

        if (!inputFocused) {
          saEtc.focusElementById(vm.inputId);
        }

        unwatchSearch = $scope.$watch('vm.dropdownInput', onSearch);

      }

    }

    function groupLabel(item) {
      return _.get(item, vm.itemsGroupProperty);
    }

    function addClick() {

      vm.newItem = vm.model.createInstance(_.assign({name: vm.dropdownInputCopy}, vm.filter || {}));

      vm.isOpen = false;

    }

    function editClick() {

      vm.newItem = vm.currentItem;

      vm.isOpen = false;

    }

    function accentLess(line) {

      let lineLowerCase = line.toLowerCase();

      let to = ['a', 'c', 'e', 'e', 'i', 's', 'u', 'u', 'z'], from = 'ąčęėįšųūž';

      let regexp = new RegExp('[' + from + ']', 'ig');

      return lineLowerCase.replace(regexp, (m) => {
        return to[from.indexOf(m)];
      });

    }

    function onSearch() {

      let search = vm.dropdownInput;

      if (!inputFocused)
        return;

      vm.filteredData = !search ? vm.data : $filter('filter')(vm.data, (item) => {

        let noAccentName = accentLess(item[vm.itemsNameProperty]);
        let noAccentSearch = accentLess(search);

        if (noAccentName.indexOf(noAccentSearch) >= 0) {
          return item
        }

      });

      vm.filteredData = $filter('orderBy')(vm.filteredData, vm.itemsNameProperty);

    }

    function itemClick(item, onEnterClick) {

      vm.use({
        currentId: item.id,
        currentItem: item
      });

      if (onEnterClick) {
        enterClicked = true;
        vm.dropdownInputCopy = vm.dropdownInput;
      }

      vm.dropdownInput = vm.currentItem[vm.itemsNameProperty];

      vm.isOpen = false;

    }

    function afterCancel($event) {

      $event.stopPropagation();
      delete vm.newItem;

      if (vm.currentItem) {
        return;
      }

      $timeout(100).then(() => {
        saEtc.focusElementById(vm.inputId);
        onInputFocus();
        vm.isOpen = true;
      });

    }

    function afterSave(saved) {

      vm.currentId = saved.id;
      vm.isOpen = false;
      delete vm.newItem;

      onCurrentId(vm.currentId);

      return $timeout(10).then(() => saved);

    }

  }

})(angular.module('webPage'));
