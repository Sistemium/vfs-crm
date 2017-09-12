(function () {

  angular.module('webPage')
    .run(routerAuth);

  function routerAuth($rootScope, Auth, $state, toastr) {

    $rootScope.$on('$stateChangeStart', $stateChangeStart);

    let pengingAuth;

    function $stateChangeStart(event, to, params) {

      let accessToken = params['access-token'] || Auth.getToken();

      let publicState = to.name === 'login';

      if (publicState && !accessToken || Auth.isLoggedIn()) return;

      event.preventDefault();

      if (!accessToken) {
        return $state.go('login');
      }

      authorize(accessToken, to, params);

    }

    function authorize(accessToken, to, params) {

      pengingAuth = pengingAuth || Auth.login(accessToken)
        .then(res => {

          pengingAuth = false;

          let roles = _.map(_.get(_.first(res.orgAccounts), 'orgAccountRoles'), 'role.code');

          toastr.success(`Jūs prisijungę kaip "${res.name}"`, 'Sveiki avykę!');
          console.warn('Login success', res, roles);

          $state.go(to, _.omit(params, 'access-token'));

        })
        .catch(err => {

          pengingAuth = false;

          toastr.error(angular.toJson(err), 'Autentifikavimo klaida');
          console.error(err);

          $state.go('login');

        });

      return pengingAuth;

    }

  }

})();