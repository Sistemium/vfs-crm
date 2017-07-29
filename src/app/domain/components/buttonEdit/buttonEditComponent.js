(function (module) {

  module.component('buttonEdit', {

    bindings: {
      buttonClick: '&'
    },

    templateUrl: 'app/domain/components/buttonEdit/buttonEdit.html',
    controllerAs: 'vm'

  });

})(angular.module('webPage'));