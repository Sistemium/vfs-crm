'use strict';

(function () {

  angular.module('webPage')
    .component('vfsLogin', {

      controller: LoginController,
      controllerAs: 'vm',

      templateUrl: 'app/domain/auth/vfsLogin/vfsLogin.html'

    });

  function LoginController($stateParams) {

    const vm = this;

    vm.buttons = [
      {
        url: 'facebook',
        name: 'Facebook',
        icon: 'images/color/icons8-facebook.png'
      },
      {
        url: 'google',
        name: 'Google',
        icon: 'images/color/icons8-google_plus.png'
      }
    ];

    vm.mobile = [{

      url: 'sms',
      name: 'SMS-kodas',
      icon: 'images/color/icons8-cell_phone.png'

    }];

    vm.error = $stateParams.error;

  }


})();
