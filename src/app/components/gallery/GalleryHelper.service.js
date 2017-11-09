'use strict';

(function () {

  angular.module('webPage')
    .service('GalleryHelper', GalleryHelper);

  function GalleryHelper($q, $templateRequest, $compile, $timeout, $document, $window) {

    function setupController(vm, $scope) {

      const $body = $document.find('body');

      let fullscreenElement;

      _.assign(vm, {

        zoom: 1,

        setZoom: _.throttle(zoom => $scope.$apply(() => vm.zoom = zoom), 200),

        thumbnailClick,
        fullScreenThumbnailClick,

        nextImageClick: setNextImage,
        prevImageClick: setPrevImage,

        closeGalleryClick: () => vm.zoom === 1 && cleanup(),

        deleteClick,

        test: () => {
          $scope.confirmDelete = !$scope.confirmDelete;
        },

        deleteCurrentImage

      });

      $scope.$on('$destroy', cleanup);

      /*
       Functions
       */

      function thumbnailClick(img) {

        if (!img) return;

        $scope.index = $scope.imagesAll.indexOf(img);

        const fn = _.result($scope, 'thumbnailClickFn') || openGallery;

        return _.isFunction(fn) && fn(img);

      }

      function fullScreenThumbnailClick(img) {
        $scope.index = $scope.imagesAll.indexOf(img);
        showImage(img);
      }

      function deleteCurrentImage() {

        let imageModel = $scope.imagesAll[$scope.index];

        if (!imageModel) {
          return console.error('ngGallery.deleteCurrentImage Failed to get image model');
        }

        imageModel.DSDestroy()
          .then(cleanup())
          .catch((err) => {
            console.error(err);
          })

      }

      function deleteClick() {
        if ($scope.confirmDelete) deleteCurrentImage();
        $scope.confirmDelete = !$scope.confirmDelete;
      }

      function cleanup() {

        $scope.opened = false;
        $body.unbind('keydown', onKeyDown);
        fullscreenElement && fullscreenElement.remove();

      }

      function setNextImage() {
        vm.zoom === 1 && setImageByIndex($scope.index + 1);
      }

      function setPrevImage() {
        vm.zoom === 1 && setImageByIndex($scope.index - 1);
      }

      function setImageByIndex(index) {
        let images = $scope.imagesAll;
        index = (images.length + index) % images.length;
        showImage(images[$scope.index = index]);
      }

      function openGallery(image) {

        $templateRequest('app/components/gallery/galleryFullscreen.html')
          .then((html) => {
            let template = angular.element(html);
            $body.append(template);
            fullscreenElement = $compile(template)($scope);
            $body.bind('keydown', onKeyDown);
            scrollThumbnailsToCurrent();
          });

        $scope.opened = true;

        return angular.isDefined(image) && showImage(image);

      }

      function loadImage(img) {

        return $q((resolve, reject) => {

          const image = _.assign(new Image(), {

            onload: function () {
              if (this.complete === false || this.naturalWidth === 0) {
                reject();
              }
              resolve(image);
            },

            onerror: reject,
            src: img.srcFullscreen

          });

        });

      }

      function showImage(img) {

        $scope.loading = true;
        $scope.confirmDelete = false;

        vm.currentImage = img;

        loadImage(img)
          .then((res) => {
            $scope.currentImageSrc = res.src;
            // scope.id = img.name;
            // smartScroll(scope.index);
          })
          .catch(() => {
            $scope.imageLoadingError = true;
          })
          .finally(() => {
            $scope.loading = false;
          });

      }

      const keyCodes = {
        enter: 13,
        esc: 27,
        left: 37,
        right: 39
      };

      function onKeyDown(event) {

        if (!$scope.opened) {
          return console.error('!scope.opened');
        }

        let which = event.which;

        if (which === keyCodes.esc) {
          cleanup();
        } else if (which === keyCodes.right || which === keyCodes.enter) {
          setNextImage();
        } else if (which === keyCodes.left) {
          setPrevImage();
        }

        $scope.$apply();

      }

      function scrollThumbnailsToCurrent() {

        $timeout(() => {

          let index = $scope.index;

          let thumbWrapper = $window.document.getElementById('ng-thumbnails-scroll');

          // TODO: Refactor if statement

          if (index != 0 && (($scope.imagesAll.length - 7) != index) && $scope.firstOpen == false) {
            thumbWrapper.scrollLeft = 70 * index + 2;
          } else {
            if (($scope.imagesAll.length - 7) == index) {
              thumbWrapper.scrollLeft = 70 * index + 2;
            } else {
              thumbWrapper.scrollLeft = 70 * index;
            }

          }

          $scope.firstOpen = false;

        }, 0);

      }

    }

    return {setupController};

  }

})();
