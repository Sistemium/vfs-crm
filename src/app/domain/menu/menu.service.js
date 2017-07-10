'use strict';

(function () {

  angular.module('webPage').service('Menu', function () {


    const items = [{
      title: 'Aptarnavimo taškai',
      state: 'servicePoints'
    }];


    function setItemData(state, data) {
      _.assign(_.find(items, {state}), data);
    }

    function root() {

      return {

        title: 'Начало',
        state: 'home',

        items: _.filter(items, function (option) {
          return option;
        })

      };

    }

    return {
      root,
      setItemData
    };

  });

})();
