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
          toastr.success(`Jūs prisijungę kaip "${res.name}"`, 'Sveiki avykę!');
          console.warn('Login success', res, _.map(_.get(_.first(res.orgAccounts), 'orgAccountRoles'), 'role.code'));
        })
        .catch(err => {
          toastr.error(angular.toJson(err), 'Autentifikavimo klaida');
          console.error(err);
        });

    }

  }
})();
