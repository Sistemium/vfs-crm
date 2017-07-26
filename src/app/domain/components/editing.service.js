'use strict';

(function () {

  angular.module('webPage')
    .service('Editing', Editing);

  function Editing($uibModal) {

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
        `  <button class="btn btn-success" ng-click="saveClick()">Išsaugoti</button>` +
        `  <button class="btn btn-danger" ng-click="cancelClick()">Atšaukti</button>` +
        `</div>`,
        size: 'lg',

        controller

      });

      modal.result.catch(() => {
        item.DSRevert();
      });

      return modal.result;

      function controller($scope) {

        _.assign($scope, {
          item,
          title,
          saveClick,
          cancelClick
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
      }

    }

  }

})();