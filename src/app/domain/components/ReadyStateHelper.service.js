'use strict';

(function () {

  angular.module('webPage')
    .service('ReadyStateHelper', ReadyStateHelper);

  function ReadyStateHelper(saControllerHelper, UUID) {

    return {setupController};

    function setupController(vm, scope, modelName) {

      saControllerHelper.setup(vm, scope)
        .use({
          id: `edit-${modelName}-${UUID.v4()}`
        });

      scope.$watch(() => vm[modelName].isValid(vm.readyState), nv => {

        if (vm.readyState) {
          vm.readyState.ready = !!nv;
        }

      });

      scope.$on('$destroy', () => {
        vm.readyState = {};
      });

      return vm;

    }

  }

})();