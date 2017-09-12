(function () {

  angular.module('webPage').component('menuSettings', {

    templateUrl: 'app/main/main.html',
    controller: menuSettingsController,
    controllerAs: 'vm'

  });

  function menuSettingsController(Menu) {

    _.assign(this, {

      data: Menu.root('settings')

    });

  }

})();