(function () {

  angular.module('webPage')
    .component('authStatus', {

      templateUrl: 'app/domain/auth/authStatus/authStatus.html',

      controller: authStatusController,
      controllerAs: 'vm'

    });

  function authStatusController(Auth, $state) {

    const vm = this;

    _.assign(vm, {
      loginClick,
      userName,
      isLoggedIn: () => !!userName()
    });

    function loginClick() {
      $state.go('login');
    }

    function userName() {
      return _.get(Auth.getCurrentUser(), 'name');
    }



  }


})();