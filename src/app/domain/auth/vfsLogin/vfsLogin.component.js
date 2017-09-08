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
        class: 'facebook-official'
      },
      {
        url: 'google',
        name: 'Google',
        class: 'google'
      },
      {
        url: 'mailru',
        name: 'Mail.ru',
        class: 'mailru'
      },
      {
        url: 'odnoklassniki',
        name: 'Одноклассники',
        class: 'odnoklassniki'
      },
      {
        url: 'vk',
        name: 'ВКонтакте',
        class: 'vk'
      }
    ];

    vm.mobile = [{

      url: 'sms',
      name: 'СМС-пароль',
      class: 'mobile'

    }];

    vm.error = $stateParams.error;

  }


})();
