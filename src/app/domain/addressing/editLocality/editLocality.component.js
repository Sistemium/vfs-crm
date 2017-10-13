(function (module) {

  module.component('editLocality', {

    bindings: {
      locality: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/addressing/editLocality/editLocality.html',
    controllerAs: 'vm'

  });


})(angular.module('webPage'));
