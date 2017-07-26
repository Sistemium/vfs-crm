'use strict';

(function () {

  angular.module('webPage')
    .service('Editing', Editing);

  function Editing($uibModal, $timeout) {

    return {editModal};

    function editModal(componentName, title) {
      return item => openEditModal(item, componentName, title);
    }

    function openEditModal(item, componentName, title) {

      let modal = $uibModal.open({

        animation: true,
        template: `<div class="modal-header"><h1>{{title}}</h1></div>` +
        `<${componentName} service-point="item" save-fn="saveFn"></${componentName}>` +
        `<div class="modal-footer">` +
        (item.id ? `  <button class="btn destroy" ng-class="confirmDestroy ? 'btn-danger' : 'btn-default'" ng-click="destroyClick()">Ištrinti</button>` : '') +
        `  <button class="btn btn-success save" ng-disabled="!item.isValid()" ng-click="saveClick()">Išsaugoti</button>` +
        `  <button class="btn btn-default cancel" ng-click="cancelClick()">Atšaukti</button>` +
        `</div>`,
        size: 'lg',

        controller

      });

      modal.result
        .catch(() => {
          if (item.id) {
            item.DSRevert();
          }
        });

      return modal.result;

      function controller($scope) {

        _.assign($scope, {
          item,
          title,
          saveClick,
          cancelClick,
          destroyClick
        });

        function saveClick() {
          if ($scope.saveFn) {
            $scope.saveFn()
              .then(modal.close);
          } else if (_.isFunction(item.DSCreate)) {
            item.DSCreate()
              .then(modal.close);
          }
        }

        function cancelClick() {
          modal.dismiss();
        }

        function destroyClick() {

          $scope.confirmDestroy = !$scope.confirmDestroy;

          if ($scope.confirmDestroy) {
            return $timeout(2000).then(() => $scope.confirmDestroy = false);
          }

          if (_.isFunction(item.DSDestroy)) {
            item.DSDestroy()
              .then(modal.close);
          } else {
            modal.dismiss();
          }

        }

      }

    }

  }

})();