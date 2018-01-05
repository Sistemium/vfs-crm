(function () {

  angular.module('webPage')
    .run((Schema, $rootScope) => {

      $rootScope.$on('socket:authorized', () => {

        const {Site, FilterSystemType, ContactMethod} = Schema.models();

        ContactMethod.findAll();
        Site.findAll();
        FilterSystemType.findAll();

      });

    });

})();