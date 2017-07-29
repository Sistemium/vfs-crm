(function (module) {

  module.component('brandList', {

    bindings: {

      brands: '='

    },

    templateUrl: 'app/domain/brand/list/brandList.html',
    controllerAs: 'vm'

  });

})(angular.module('webPage'));
