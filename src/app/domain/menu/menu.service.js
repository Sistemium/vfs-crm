'use strict';

(function () {

  angular.module('webPage').service('Menu', function () {

    const items = [{
      title: 'Aptarnavimo taškai',
      state: 'servicePoint'
    }, {
      title: 'Darbuotojai',
      state: 'employee'
    }, {
      title: 'Filtravimo sistemos',
      state: 'filterSystem'
    }, {
      title: 'Aptarnavimo sutartys',
      state: 'serviceContract'
    }, {
      title: 'Įmonės',
      state: 'legalEntity',
      disabled: true
    }, {
      title: 'Asmenys',
      state: 'person'
    }, {
      title: 'Aptarnavimas',
      state: 'serviceOrder',
      disabled: true
    }, {
      title: 'Naudotojai',
      state: 'users',
      disabled: true
    }, {
      title: 'Nustatymai',
      state: 'settings',
      disabled: true
    }];

    const icons = [
      'color/icons8-Geo-fence-80.png',
      'color/icons8-Worker-80.png',
      'color/icons8-Plumbing-80.png',
      'color/icons8-Agreement-80.png',
      'color/icons8-Organization-80.png',
      'color/icons8-User Groups-80.png',
      'color/icons8-maintenance.png',
      'color/icons8-user_folder.png',
      'color/icons8-settings.png'
    ];

    _.each(icons, (icon, idx) => items[idx].icon = icon);

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
