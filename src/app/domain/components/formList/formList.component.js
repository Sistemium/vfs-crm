(function (module) {

  module.component('sabFormList', {

    transclude: true,

    bindings: {
      title: '@',
      modelName: '@',
      addClick: '&',
      newItem: '=editing',
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
      cancelClick,
      componentName,
      editTitle
    });

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
      vm.newItem = null;
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