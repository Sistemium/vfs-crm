(function () {

  angular.module('webPage')
    .run((Schema, $rootScope) => {

      $rootScope.$on('authorized', () => {

        const {Site, FilterSystemType} = Schema.models();

        Site.findAll();
        FilterSystemType.findAll();

      });

    });

})();