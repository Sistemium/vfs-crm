(function (module) {

  module.component('servicePointList', {

    bindings: {
      servicePoints: '=',
      servicePointClickFn: '='
    },

    templateUrl: 'app/domain/servicePoint/list/servicePointList.html',
    controllerAs: 'vm'

  });

})(angular.module('webPage'));
