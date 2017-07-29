(function (module) {

  module.component('buttonAdd', {

    bindings: {
      buttonClick: '&'
    },

    templateUrl: 'app/domain/components/buttonAdd/buttonAdd.html',
    controllerAs: 'vm'

  });

})(angular.module('webPage'));