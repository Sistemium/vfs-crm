(function (module) {

  module.component('sabFormList', {

    transclude: true,

    bindings: {
      title: '@',
      modelName: '@',
      addClick: '&',
      editing: '<',
      filter: '<',
      defaults: '<'
    },

    templateUrl: 'app/domain/components/formList/formList.html',
    controller: sabFormListController,
    controllerAs: 'vm'

  });

  function sabFormListController(Schema) {

    const vm = _.assign(this, {
      addClick,
      saveClick,
      componentName,
      editTitle
    });

    function editTitle() {
      return `Naujas įrasas apie ${_.get(model(), 'meta.label.about')}`;
    }

    function model() {
      return Schema.model(vm.modelName);
    }

    function saveClick() {
      vm.newItem.DSCreate()
        .then(() => vm.newItem = false);
    }

    function addClick() {
      vm.newItem = Schema.model(vm.modelName).createInstance(_.assign({}, vm.filter, vm.defaults));
    }

    function componentName() {
      return `edit-${_.kebabCase(vm.modelName)}`
    }

  }

})(angular.module('webPage'));