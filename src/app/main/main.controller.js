(function () {
  'use strict';

  angular
    .module('webPage')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(Menu, Schema) {

    const vm = this;
    const { Site } = Schema.models();

    _.assign(vm, {
        data: Menu.root(),
        disabled() {
          return !Site.meta.getCurrent();
        },
        header: {
          title: 'Pagrindinis meniu'
        }
      }
    );

  }
})();
