'use strict';

(function () {

  function transformToComponentDirective($compile) {

    return {

      scope: {
        componentName: '@',
        instance: '='
      },

      restrict: 'E',
      controller: transformToComponentController,
      controllerAs: 'vm',
      bindToController: true,

      link: function (scope, element, attrs) {

        let {componentName} = attrs;
        let itemName = _.last(componentName.match(/edit-(.*)/));

        let template = angular.element(`<${componentName} ${itemName}="vm.instance"></${componentName}>`);

        element.append(template);
        $compile(template)(scope);

      }

    };
  }

  angular.module('webPage')
    .directive('transformToComponent', transformToComponentDirective);

  function transformToComponentController() {

    let vm = this;

    _.assign(vm, {});

  }

})();
