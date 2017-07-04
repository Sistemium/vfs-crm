(function() {

  angular
    .module('webPage')
    .directive('stmMenu', menuDirective);

  /** @ngInject */
  function menuDirective($rootScope) {
    return {

      restrict: 'AC',
      templateUrl: 'app/domain/menu/menu.html',
      scope: {
        header: '=',
        items: '='
      },

      controller: function menuDirectiveController() {
        $rootScope.$broadcast('menu-show');
      }

    };
  }

})();
