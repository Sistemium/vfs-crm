(function (module) {

  module.component('editStreet', {

    bindings: {
      employee: '='
    },

    templateUrl: 'app/domain/addressing/editStreet/editStreet.html',
    controllerAs: 'vm'

  });


})(angular.module('webPage'));
