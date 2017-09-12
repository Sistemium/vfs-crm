(function (module) {

  module.component('editStreet', {

    bindings: {
      street: '='
    },

    templateUrl: 'app/domain/addressing/editStreet/editStreet.html',
    controllerAs: 'vm',

    controller: editStreetController

  });

  function editStreetController() {

    const vm = _.assign(this, {
      $onInit
    });

    function $onInit() {
      vm.districtId = _.get(vm.street, 'locality.districtId') || null;
    }

  }

})(angular.module('webPage'));
