(function () {
  'use strict';

  angular
    .module('webPage')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Menu) {

    const vm = this;

    _.assign(vm, {
        data: Menu.root(),
        header: {
          title: 'Vandens Filtravimo CRM'
        }
      }
    );

  }
})();
