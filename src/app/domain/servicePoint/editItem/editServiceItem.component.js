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

  function controller(Editing, $q) {

    const vm = _.assign(this, {
      $onDestroy,
      $onInit
    });

    Editing.setupController(vm);

    /*
     Functions
     */

    function afterSave() {
      $q.when(vm.whenDone())
        .then(() => {
          _.result(vm.item, 'servicePoint.refreshCache');
        })
    }

    function $onInit() {
      _.assign(vm,{
        afterSave,
        afterCancel: vm.whenDone
      })
    }

    function $onDestroy() {
      if (vm.item.id && vm.item.DSHasChanges()) {
        vm.item.DSRevert();
      }
    }

  }

})(angular.module('webPage'));
