(function () {

  angular.module('webPage')
    .component('authStatus', {

      templateUrl: 'app/domain/auth/authStatus/authStatus.html',

      controller: authStatusController,
      controllerAs: 'vm'

    });

  function authStatusController(Auth, $state, ConfirmModal) {

    const vm = this;

    _.assign(vm, {
      loginClick,
      nameClick,
      userName,
      isLoggedIn: () => {

        if (Auth.isLoggedIn()) {
          userName();
          return Auth.isLoggedIn();
        } else {
          vm.user = {};
          return false
        }

      },
      notLoggedInText,
      user: {}
    });

    /*
    Functions
     */

    function notLoggedInText() {
      return $state.current.name === 'login' ? '' : 'Prisijungti';
    }

    function loginClick() {
      $state.go('login');
    }

    function nameClick() {

      let config = {title: 'Baigti darba?', text: 'Paspauskite "Taip" kad išsiregistruoti iš sistemos'};

      ConfirmModal.show(config)
        .then(() => {
          Auth.logout();
          $state.go('login');
        });

    }

    function userName() {
      let splitName = Auth.getCurrentUser().name.split(' ');
      vm.user.name = splitName[0];
      vm.user.lastName = splitName[1];

      //vm.user.name = 'Anachita';
      //vm.user.lastName = 'Sarachmatullojeva';
    }

  }

})();