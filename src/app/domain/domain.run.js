(function () {

  angular.module('webPage')
  .run((Schema, $rootScope) => {

    $rootScope.$on('authorized', () => {

      const {Site} = Schema.models();
      Site.findAll();

    })

  });

})();