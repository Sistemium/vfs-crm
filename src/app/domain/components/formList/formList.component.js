(function (module) {

  module.component('sabFormList', {

    transclude: true,

    bindings: {
      title: '@',
      modelName: '@',
      addClick: '&',
      newItem: '=editing',
      filter: '<',
      defaults: '<',
      readyState: '=?',
      items: '=?',
      autoNew: '<'
    },

    templateUrl: 'app/domain/components/formList/formList.html',
    controller: sabFormListController,
    controllerAs: 'vm'

  });

  function sabFormListController(Schema, $scope, $timeout) {

    const vm = _.assign(this, {
      addClick,
      saveClick,
      cancelClick,
      editClick,
      editItemComponentName,
      showItemComponentName,
      editTitle,
      $onInit,
      $onDestroy,
      deleteItemClick,
      unsaved: []
    });

    const readyStates = [];

    /*
    Functions
     */

    function $onInit() {

      let currentModel = model();

      vm.readyState = vm.readyState || [];

      if (_.filter(vm.filter, _.isUndefined).length) {
        vm.savedItems = [];
        onItemsChange()
      } else {
        currentModel.findAll(vm.filter);
        currentModel.bindAll(vm.filter, $scope, 'vm.savedItems', onItemsChange);
      }

      if (vm.autoNew) {
        addClick();
      }

    }

    function $onDestroy() {
      _.each(readyStates, readyState => {
        let {item} = readyState;
        item && item.id && item.DSRevert();
      });
    }

    function deleteItemClick(item) {

      let {id} = item;

      if (!id) {
        _.remove(vm.unsaved, item);
        _.remove(readyStates, {item});
        vm.readyState = _.map(readyStates, 'readyState');
        onItemsChange();
        return;
      }

      let promise = (vm.deleteConfirm === id) ?
        item.DSDestroy() :
        $timeout(2000);

      vm.deleteConfirm = id;

      promise.then(() => vm.deleteConfirm === id && (vm.deleteConfirm = false));

    }

    function onItemsChange() {

      let {savedItems} = vm;
      let items = [...savedItems];

      items.push(...vm.unsaved);

      vm.items = _.orderBy(items, ['date'], ['desc']);

    }

    function editTitle() {
      let isNew = !_.get(vm.newItem, 'id');
      let about = _.get(model(), 'meta.label.about');
      return `${isNew ? 'Naujas įrašas' : 'Įrašo'} apie ${about}${isNew ? '' : ' redagavimas'}`;
    }

    function model() {
      return Schema.model(vm.modelName);
    }

    function cancelClick() {

      if (vm.newItem.id) {
        vm.newItem.DSRevert();
      }

      _.remove(readyStates, {item: vm.readyState[0]});
      vm.readyState.splice(0, 1);

      _.remove(vm.unsaved, vm.newItem);
      vm.newItem = null;

    }

    function saveClick() {

      onItemsChange();

      if (!vm.newItem.isValid()) {
        vm.newItem = false;
        return;
      }

      vm.newItem.DSCreate()
        .then(() => {
          vm.readyState.splice(0, 1);
          _.remove(readyStates, {item: vm.newItem});
          _.remove(vm.unsaved, vm.newItem);
          vm.newItem = false;
        });

    }

    function editClick(item) {

      let readyState = {
        postSave: () => {
          return _.assign(item, vm.filter).DSCreate()
            .then(() => _.remove(vm.unsaved, item));
        }
      };

      _.each(vm.filter, (val, key) => {
        readyState[key] = {ready: true};
      });

      readyStates.push({readyState, item});

      vm.readyState.splice(0, 0, readyState);
      vm.newItem = item;

    }

    function addClick() {

      let newItem = Schema.model(vm.modelName)
        .createInstance(_.assign({}, vm.filter, vm.defaults));

      vm.unsaved.push(newItem);

      editClick(newItem);

    }

    function editItemComponentName() {
      return `edit-${_.kebabCase(vm.modelName)}`;
    }

    function showItemComponentName() {
      return `show-${_.kebabCase(vm.modelName)}`
    }

  }

})(angular.module('webPage'));