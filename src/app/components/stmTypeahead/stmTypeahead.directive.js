'use strict';

(function () {

  function stmTypeaheadDirective($templateRequest, $compile) {

    return {

      restrict: 'EA',
      scope: {
        inputModel: '=',
        currentSelected: '=selectedModel',
        addButtonClickFn: '&',
        placeholder: '@',
        placeholderFocused: '@',
        rowsFilters: '@',
        rowsData: '=',
        rowAs: '@',
        inputClass: '@',
        inputId: '@',
        inputFocusFn: '&',
        inputBlurFn: '&',
        onSelectItemFn: '&'
      },
      controller: stmTypeaheadController,
      controllerAs: 'vm',
      bindToController: true,

      link: function (scope, element, attrs, ctrl) {

        ctrl.rootElement = element;
        ctrl.scope = scope;

        $templateRequest('app/components/stmTypeahead/stmTypeahead.html')
          .then(function (html) {

            ctrl.rowsFilters = _.replace(ctrl.rowsFilters, `'`, '"');
            var typeAhead = `uib-typeahead='row as row.${ctrl.rowAs} for row in vm.rowsData${ctrl.rowsFilters && "|" + ctrl.rowsFilters}'`;
            html = html.replace('uib-typeahead', typeAhead);

            ctrl.inputEditable = angular.isDefined(attrs.inputEditable);
            var inputEditable = `typeahead-editable='${ctrl.inputEditable}'`;
            html = html.replace('typeahead-editable', inputEditable);

            ctrl.trimEnabled = angular.isDefined(attrs.trimEnabled) ? attrs.trimEnabled : 'true';
            var trimEnabled = `ng-trim='${ctrl.trimEnabled}'`;
            html = html.replace('trim-enabled', trimEnabled);

            ctrl.inputRequired = angular.isDefined(attrs.inputRequired) ? attrs.inputRequired : 'false';
            var inputRequired = `ng-required='${ctrl.inputRequired}'`;
            html = html.replace('input-required', inputRequired);

            var template = angular.element(html);
            element.append(template);
            $compile(template)(scope);

          });
      }

    };
  }

  angular.module('webPage')
    .directive('stmTypeahead', stmTypeaheadDirective);

  function stmTypeaheadController($scope, $uiViewScroll, $uibPosition, $window, $timeout) {

    var vm = this;

    _.assign(vm, {

      currentPlaceholder: vm.placeholder,

      popupHeightRecalc,
      inputFocus,
      inputBlur,
      onSelectItem,
      addButtonClick

    });

    function popupHeightRecalc() {

      var vpo = $uibPosition.viewportOffset(vm.typeaheadElement);
      if (vpo) {
        vm.popupHeightPx = `${$window.innerHeight - vpo.top - 50}px`;
      }

    }

    function inputFocus() {

      vm.inputModel = vm.lastSearch || '';
      vm.currentPlaceholder = vm.placeholderFocused;
      $uiViewScroll(vm.rootElement.parent().parent())
        .then(()=>$timeout(100).then(vm.popupHeightRecalc));

    }

    function inputBlur(event) {

      if (_.get(event, 'defaultPrevented')) {
        return;
      }

      $timeout(300).then(() => vm.popupHeightPx = 0);

      vm.currentPlaceholder = vm.placeholder;

      if (!angular.isObject(vm.inputModel)) {

        vm.lastSearch = vm.inputModel;
        vm.inputModel = vm.currentSelected || vm.inputModel;

      }

    }

    function onSelectItem($item) {

      vm.currentSelected = $item;
      vm.onSelectItemFn() && vm.onSelectItemFn()($item);

    }

    function addButtonClick(event) {

      event.preventDefault();
      vm.addButtonClickFn() && vm.addButtonClickFn()(vm.lastSearch);

    }

    $scope.$watch('vm.inputModel', (newValue)=> {
      if (!angular.isObject(newValue)) {
        vm.lastSearch = vm.inputModel;
      }
    });

  }

})();
