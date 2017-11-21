(function () {

  angular.module('webPage')
    .run((Schema, $rootScope) => {

      $rootScope.$on('authorized', () => {

        const {Site, FilterSystemType, ContactMethod} = Schema.models();

        ContactMethod.findAll();
        Site.findAll();
        FilterSystemType.findAll();

      });

    });

})();