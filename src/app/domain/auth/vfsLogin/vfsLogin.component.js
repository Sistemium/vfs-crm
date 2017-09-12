'use strict';

(function () {

  angular.module('webPage')
    .component('vfsLogin', {

      controller: LoginController,
      controllerAs: 'vm',

      templateUrl: 'app/domain/auth/vfsLogin/vfsLogin.html'

    });

  function LoginController($state) {

    const buttons = [
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

    const mobile = [{

      url: 'sms',
      name: 'SMS-kodas',
      icon: 'images/color/icons8-cell_phone.png'

    }];

    const vm = _.assign(this, {
      closeErrorClick,
      buttons,
      mobile
    });

    vm.error = $state.params.error;

    function closeErrorClick() {
      vm.error = false;
      // $state.go('login', {}, {reload: true});
    }

  }


})();
