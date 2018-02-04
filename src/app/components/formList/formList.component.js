(function () {

  angular.module('sistemiumBootstrap.directives')
    .component('sabFormList', {

      transclude: true,

      bindings: {
        title: '@',
        modelName: '@',
        addClick: '&',
        editing: '<',
        filter: '<'
      },

      templateUrl: 'app/components/formList/formList.html',
      controller: sabFormListController,
      controllerAs: 'vm'

    });

  function sabFormListController(Schema) {

    const vm = _.assign(this, {
      addClick,
      saveClick,
      componentName
    });

    function saveClick() {
      vm.newItem.DSCreate()
        .then(() => vm.newItem = false);
    }

    function addClick() {
      vm.newItem = Schema.model(vm.modelName).createInstance(vm.filter || {});
    }

    function componentName() {
      return `edit-${_.kebabCase(vm.modelName)}`
    }

  }

})();