'use strict';

(function () {

  angular.module('webPage')
    .service('ReadyStateHelper', ReadyStateHelper);

  function ReadyStateHelper(saControllerHelper, UUID) {

    return {setupController};

    function setupController(vm, scope, bindingName) {

      saControllerHelper.setup(vm, scope)
        .use({
          id: `edit-${bindingName}-${UUID.v4()}`
        });

      scope.$watch(() => vm[bindingName].isValid(vm.readyState), nv => {

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