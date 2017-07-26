(function (module) {

  module.component('editServiceItem', {

    bindings: {
      item: '=',
      whenDone: '&'
    },

    templateUrl: 'app/domain/servicePoint/editItem/editServiceItem.html',
    controller,
    controllerAs: 'vm'

  });

  function controller(toastr, $timeout) {

    const vm = _.assign(this, {
      cancelClick,
      saveClick,
      $onDestroy,
      destroyClick
    });


    /*
     Functions
     */

    function $onDestroy() {
      if (vm.item.id && vm.item.DSHasChanges()) {
        vm.item.DSRevert();
      }
    }

    function cancelClick() {

      if (vm.item.id) {
        vm.item.DSRevert();
      }

      vm.whenDone();

    }

    function saveClick() {

      vm.item.DSCreate()
        .then(() => vm.whenDone())
        .catch(err => toastr.error(angular.toJson(err)));

    }

    function destroyClick() {

      vm.confirmDestroy = !vm.confirmDestroy;

      if (vm.confirmDestroy) {
        return $timeout(2000).then(() => vm.confirmDestroy = false);
      }

      if (_.isFunction(vm.item.DSDestroy)) {
        vm.item.DSDestroy()
          .then(() => vm.whenDone());
      } else {
        vm.whenDone()
      }

    }

  }

})(angular.module('webPage'));
