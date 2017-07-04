angular.module('core.services')

  .directive('saNumberSpinner', function() {
    'use strict';

    var setScopeValues = function (scope, attrs) {
      scope.min = attrs.min || 0;
      scope.max = attrs.max || 100;
      scope.step = attrs.step || 1;
      // scope.prefix = attrs.prefix || undefined;
      // scope.postfix = attrs.postfix || undefined;
      scope.decimals = attrs.decimals || 0;
      scope.initval = attrs.initval || '';
      scope.val = attrs.value || scope.initval;
    };

    return {
      restrict: 'EA',
      require: '?ngModel',
      scope: true,
      replace: true,
      link: function (scope, element, attrs, ngModel) {
        setScopeValues(scope, attrs);

        var oldval = scope.val;

        ngModel.$setViewValue(scope.val);

        scope.decrement = function () {
          oldval = scope.val;
          var value = parseFloat(parseFloat(Number(scope.val)) - parseFloat(scope.step)).toFixed(scope.decimals);

          if (value < scope.min) {
            value = parseFloat(scope.min).toFixed(scope.decimals);
            scope.val = value;
            ngModel.$setViewValue(value);
            return;
          }

          scope.val = value;
          ngModel.$setViewValue(value);
        };

        scope.increment = function () {
          oldval = scope.val;
          var value = parseFloat(parseFloat(Number(scope.val)) + parseFloat(scope.step)).toFixed(scope.decimals);

          if (value > scope.max) {
            return;
          }

          scope.val = value;
          ngModel.$setViewValue(value);
        };

        scope.checkValue = function () {
          var val;

          if (scope.val !== '' && !scope.val.match(/^-?(?:\d+|\d*\.\d+)$/i)) {
            val = oldval !== '' ? parseFloat(oldval).toFixed(scope.decimals) : parseFloat(scope.min).toFixed(scope.decimals);
            scope.val = val;
          }
          ngModel.$setViewValue(scope.val);
        };

      },
      template:
      '<div class="input-group">' +
      '  <span class="input-group-btn">' +
      '    <button type="button" class="btn btn-primary" ng-click="decrement()"><i class="glyphicon glyphicon-minus"></i></button>' +
      '  </span>' +
      //'  <span class="input-group-addon" ng-if="prefix" ng-bind="prefix"></span>' +
      '  <input type="text" ng-model="val" class="form-control centered" ng-blur="checkValue()">' +
      //'  <span class="input-group-addon" ng-if="postfix" ng-bind="postfix"></span>' +
      '  <span class="input-group-btn">' +
      '    <button type="button" class="btn btn-primary" ng-click="increment()"><i class="glyphicon glyphicon-plus"></i></button>' +
      '  </span>' +
      '</div>'
    };

  });
