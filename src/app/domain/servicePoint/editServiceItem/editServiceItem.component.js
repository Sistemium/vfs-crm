(function (module) {

  module.component('editServiceItem', {

    bindings: {
      serviceItem: '='
    },

    templateUrl: 'app/domain/servicePoint/editServiceItem/editServiceItem.html',
    controllerAs: 'vm',
    controller: editServiceItem

  });

  function editServiceItem() {
  }

})(angular.module('webPage'));
