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

    const vm = _.assign(this, {
      cancelClick,
      saveClick,
      $onDestroy
    });

    console.error(vm.item);

    function $onDestroy() {
      if (vm.item.id && vm.item.DSHasChanges()) {
        vm.item.DSRevert();
      }
    }

    function cancelClick() {

      console.log(vm.item.id);
      
      if (vm.item.id) {
        vm.item.DSRevert();
      }
      vm.whenDone();
    }

    function saveClick() {
      console.log(vm.item);
      vm.item.DSCreate()
      .then(() => vm.whenDone())
      .catch(err => toastr.error(angular.toJson(err)));
    }

  }

})(angular.module('webPage'));
