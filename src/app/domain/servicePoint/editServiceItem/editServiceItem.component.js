(function (module) {

  module.component('editServiceItem', {

    bindings: {
      serviceItem: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/servicePoint/editServiceItem/editServiceItem.html',
    controllerAs: 'vm',
    controller: editServiceItem

  });

  function editServiceItem() {
  }

})(angular.module('webPage'));
