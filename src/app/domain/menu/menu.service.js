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
      'icons8-Marker.png',
      'icons8-Worker.png',
      'icons8-Plumbing.png',
      'icons8-Agreement.png',
      'icons8-Organization.png',
      'icons8-People.png',
      'icons8-Maintenance.png',
      'icons8-User-Folder.png',
      'icons8-Cog.png'
    ];

    //const iconsOld = [
    //  'color/icons8-Marker.png',
    //  'color/icons8-Worker.png',
    //  'color/icons8-Plumbing.png',
    //  'color/icons8-Agreement.png',
    //  'color/icons8-Organization.png',
    //  'color/icons8-People.png',
    //  'color/icons8-Maintenance.png',
    //  'color/icons8-User-Folder.png',
    //  'color/icons8-Cog.png'
    //];

    _.each(icons, (icon, idx) => {
      items[idx].icon = icon;
    });


    function setItemData(state, data) {
      _.assign(_.find(items, {state}), data);
    }

    function root() {

      return {

        title: 'Pradžia',
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
