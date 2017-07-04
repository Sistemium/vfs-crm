'use strict';

(function () {

  angular.module('webPage')
    .directive('ngGallery', ngGallery);

  function GalleryController($scope, GalleryHelper) {

    const vm = this;

    GalleryHelper.setupController(vm, $scope);

  }

  function ngGallery($timeout) {

    const defaults = {
      baseClass: 'ng-gallery',
      thumbClass: 'ng-thumb',
      templateUrl: 'app/components/gallery/galleryTemplate.html'
    };

    function setScopeValues(scope) {
      scope.baseClass = scope.class || defaults.baseClass;
      scope.thumbClass = scope.thumbClass || defaults.thumbClass;
      scope.thumbsNum = scope.thumbsNum || 1; // should be odd
    }

    return {

      restrict: 'EA',

      scope: {
        imagesAll: '=',
        thumbImage: '=',
        thumbsNum: '@',
        hideOverflow: '=',
        imageHoveredFn: '&',
        thumbnailClickFn: '&',
        isDeletable: '='
      },

      controller: GalleryController,

      controllerAs: 'vm',

      templateUrl: function (element, attrs) {
        return attrs.templateUrl || defaults.templateUrl;
      },

      link: function (scope, element, attrs) {

        setScopeValues(scope, attrs);

        if (scope.thumbsNum >= 11) {
          scope.thumbsNum = 11;
        }

        function hideNavElements() {
          $timeout(function () {
            scope.showNavElems = false;
          }, 2000);
        }

        hideNavElements();

        scope.showNavElems = true;
        scope.index = 0;
        scope.opened = false;
        scope.firstOpen = true;

        scope.setHovered = (image) => {
          if (_.isFunction(scope.imageHoveredFn())) {
            scope.imageHoveredFn()(image);
          }
        };

      }

    };

  }

})();
