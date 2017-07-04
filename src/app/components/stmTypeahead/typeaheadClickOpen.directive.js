'use strict';

(function () {

  angular.module('webPage')
    .directive('typeaheadClickOpen', function ($timeout) {

      return {

        require: 'ngModel',

        link: function ($scope, elem, attrs, ctrl) {

          //ctrl.$viewChangeListeners.push(function() {
          //  console.log('ctrl.$modelValue', ctrl.$modelValue);
          //  console.log('ctrl.$viewValue', ctrl.$viewValue);
          //});

          $scope.vm.typeaheadElement = elem;

          elem.bind('focus', () => $scope.$apply(()=>$scope.vm.startClickOpen = true));

          elem.bind('click', () => {

            var prev = ctrl.$viewValue;

            if (angular.isDefined(prev)) {

              ctrl.$setViewValue();

              $timeout(10)
                .then(()=>{
                    ctrl.$setViewValue(prev);
                  $scope.vm.startClickOpen = false;
                });
            } else {
              $scope.vm.startClickOpen = false;
            }

          });

        }

      };

    });

})();
