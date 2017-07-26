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

  function controller(toastr) {

    const vm = _.assign(this,{
      cancelClick,
      saveClick,
      $onDestroy
    });

    function $onDestroy() {
      if (vm.item.DSHasChanges()) {
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

  }

})(angular.module('webPage'));
