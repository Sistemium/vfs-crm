(function () {

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

      controller: function menuDirectiveController($state) {

        $rootScope.$broadcast('menu-show');

        let vm = this;

        _.assign(vm, {
          itemClick
        });

        function itemClick(item) {

          if (item.isDisabled) return;

          if (item.state) {
            $state.go(item.state);
          }

        }

      },
      controllerAs: 'vm'

    };
  }

})();
