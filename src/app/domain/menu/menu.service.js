'use strict';

(function () {

  angular.module('webPage').service('Menu', function () {

    const settings = [{
      title: 'Padaliniai',
      state: 'site',
      icon: 'color/icons8-department.png'
    }, {
      title: 'Filtravimo sistemų tipai',
      state: 'filterSystemType',
      icon: 'color/icons8-Plumbing.png'
    }, {
      title: 'Prekių Ženklai',
      state: 'brand',
      icon: 'color/icons8-filtration.png'
    }];

    const items = [{
      title: 'Aptarnavimo taškai',
      state: 'servicePoint',
      icon: 'color/icons8-Marker.png'
    }, {
      title: 'Darbuotojai',
      state: 'employee',
      icon: 'color/icons8-Worker.png'
    }, {
      title: 'Filtravimo sistemos',
      state: 'filterSystem',
      icon: 'color/icons8-Plumbing.png'
    }, {
      title: 'Aptarnavimo sutartys',
      state: 'serviceContract',
      icon: 'color/icons8-Agreement.png'
    }, {
      title: 'Įmonės',
      state: 'legalEntity',
      icon: 'color/icons8-Organization.png'
    }, {
      title: 'Asmenys',
      state: 'person',
      icon: 'color/icons8-People.png'
    }, {
      title: 'Aptarnavimas',
      state: 'serviceOrder',
      icon: 'color/icons8-Maintenance.png',
      disabled: true
    }, {
      title: 'Naudotojai',
      state: 'users',
      icon: 'color/icons8-User-Folder.png',
      disabled: true
    }, {
      title: 'Nustatymai',
      state: 'settings',
      icon: 'color/icons8-Cog.png',
      items: settings
    }];

    function setItemData(state, data) {
      _.assign(_.find(items, {state}), data);
    }

    function root(name) {

      let state = _.find(items, {state: name});

      if (state) {
        return state;
      }

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
