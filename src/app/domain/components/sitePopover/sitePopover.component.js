(function (module) {

  module.component('sitePopover', {

    bindings: {
      current: '=?'
    },

    templateUrl: 'app/domain/components/sitePopover/site.popover.html',

    controller: sitePopoverController,
    controllerAs: 'vm'

  });

  function sitePopoverController($scope, Schema, saControllerHelper) {

    const {Site} = Schema.models();

    const vm = saControllerHelper.setup(this, $scope)
      .use({
        optionClick
      });

    vm.rebindAll(Site, {}, 'vm.data', initCurrent);

    function initCurrent() {
      Site.meta.initCurrent()
        .then(modelCurrent => vm.current = modelCurrent);
    }

    function optionClick(option) {
      vm.current = option;
      vm.popoverIsOpen = false;
      Site.meta.setCurrent(option);
    }

  }


})(angular.module('webPage'));