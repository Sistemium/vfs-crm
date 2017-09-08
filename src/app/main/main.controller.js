(function () {
  'use strict';

  angular
    .module('webPage')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Menu, $state, Auth, toastr) {

    const vm = this;

    _.assign(vm, {
        data: Menu.root(),
        header: {
          title: 'Pagrindinis meniu'
        }
      }
    );

    let accessToken = $state.params['access-token'];

    if (accessToken) {

      Auth.login(accessToken)
        .then(res => {
          console.warn('Login success', res);
          toastr.success('Login success');
        })
        .catch(err => {
          toastr.error('Ошибка авторизации', angular.toJson(err));
          console.error(err);
        });

    }

  }
})();
