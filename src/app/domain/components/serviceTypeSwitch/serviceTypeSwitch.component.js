(function () {

  angular.module('webPage')
    .component('serviceTypeSwitch', {

      bindings: {
        type: '=ngModel',
      },

      templateUrl: 'app/domain/components/serviceTypeSwitch/serviceTypeSwitch.html',
      controllerAs: 'vm'

    });

})();