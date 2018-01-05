(function () {

  angular.module('webPage')
    .run(routerAuth);

  function routerAuth($rootScope, Auth, $state, toastr) {

    $rootScope.$on('$stateChangeStart', $stateChangeStart);

    let pendingAuth;

    function $stateChangeStart(event, to, params) {

      let accessToken = params['access-token'] || Auth.getToken();

      let publicState = to.name === 'login';

      if (publicState && !accessToken || Auth.isLoggedIn()) return;

      event.preventDefault();

      if (!accessToken) {
        console.warn('Redirecting to login state');
        return $state.go('login');
      }

      authorize(accessToken, to, params);

    }

    function authorize(accessToken, to, params) {

      pendingAuth = pendingAuth || Auth.login(accessToken)
        .then(res => {

          pendingAuth = false;

          let roles = _.map(_.get(_.first(res.orgAccounts), 'orgAccountRoles'), 'role.code');

          toastr.success(`Jūs prisijungę kaip "${res.name}"`, 'Sveiki avykę!');
          console.warn('Login success', res, roles);

          $state.go(to, _.omit(params, 'access-token'));

        })
        .catch(err => {

          pendingAuth = false;

          toastr.error(angular.toJson(err), 'Autentifikavimo klaida');
          console.error(err);

          $state.go('login');

        });

      return pendingAuth;

    }

  }

})();