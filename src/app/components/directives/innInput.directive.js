'use strict';

/*

 https://ru.wikipedia.org/wiki/Идентификационный_номер_налогоплательщика

 https://ru.wikipedia.org/wiki/Контрольное_число#.D0.9D.D0.BE.D0.BC.D0.B5.D1.80.D0.B0_.D0.98.D0.9D.D0.9D
 «Алгоритм для вычисления контрольных чисел в ИНН получен из случайных неофициальных источников в Интернете и не может использоваться в случаях, предполагающих какую-либо юридическую или финансовую ответственность, выгоду или убытки. В этом случае рекомендуется пользоваться сайтами для проверок юридической значимости и действительности таких номеров»

 */


(function () {
  angular.module('core.services')
    .directive('innInput', innInput);

  function innInput() {

    var placeholder = 'Индивидуальный номер налогоплательщика';
    var innRegexp = /^(\d{10}|\d{12}|^$)$/;

    return {
      restrict: 'AC',
      require: 'ngModel',

      controller: function ($scope) {

        if (angular.isUndefined($scope.placeholder)) $scope.placeholder = placeholder;

        if (angular.isUndefined($scope.innPattern)) $scope.innPattern = (function () {

          return {
            test: function (value) {
              return innRegexp.test(value);
            }
          };
        })();

      },

      link: function (scope, elm, attrs, ctrl) {

        ctrl.$validators.innInput = function (modelValue, viewValue) {

          if (angular.isUndefined(viewValue) || viewValue === null || viewValue.length === 0) return true;

          if (innRegexp.test(viewValue)) {

            if (viewValue.length === 10) return checkTenDigitsINN(viewValue);
            if (viewValue.length === 12) return checkTwelveDigitsINN(viewValue);

          }

          return false;

        };

        function checkTenDigitsINN(inn) {

          var dgts = inn.split('');
          var checkSum = ((2*dgts[0] + 4*dgts[1] + 10*dgts[2] + 3*dgts[3] + 5*dgts[4] + 9*dgts[5] + 4*dgts[6] + 6*dgts[7] + 8*dgts[8]) % 11) % 10;
          return (dgts[9] == checkSum);

        }

        function checkTwelveDigitsINN(inn) {

          var dgts = inn.split('');
          var checkSum1 = ((7*dgts[0] + 2*dgts[1] + 4*dgts[2] + 10*dgts[3] + 3*dgts[4] + 5*dgts[5] + 9*dgts[6] + 4*dgts[7] + 6*dgts[8] + 8*dgts[9]) % 11) % 10;

          if (dgts[10] == checkSum1) {

            var checkSum2 = ((3*dgts[0] + 7*dgts[1] + 2*dgts[2] + 4*dgts[3] + 10*dgts[4] + 3*dgts[5] + 5*dgts[6] + 9*dgts[7] + 4*dgts[8] + 6*dgts[9] + 8*dgts[10]) % 11) % 10;
            return (dgts[11] == checkSum2);

          }
          return false;

        }

      }

    };
  }

})();
