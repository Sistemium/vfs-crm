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
        template: `<div class="modal-header"><h1>{{vm.title}}</h1></div>` +
        `<${componentName} service-point="vm.item" save-fn="vm.saveFn"></${componentName}>` +
        `<div class="modal-footer">` +
        (item.id ? `  <button class="btn destroy" ng-class="vm.confirmDestroy ? 'btn-danger' : 'btn-default'" ng-click="vm.destroyClick()">Ištrinti</button>` : '') +
        `  <button class="btn btn-success save" ng-disabled="!vm.item.isValid()" ng-click="vm.saveClick()">Išsaugoti</button>` +
        `  <button class="btn btn-default cancel" ng-click="vm.cancelClick()">Atšaukti</button>` +
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

        const vm = {};

        $scope.vm = vm;

        _.assign(vm, {
          item,
          title,
          saveClick,
          cancelClick,
          destroyClick
        });

        function saveClick() {
          if (vm.saveFn) {
            vm.saveFn()
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

          vm.confirmDestroy = !vm.confirmDestroy;

          if (vm.confirmDestroy) {
            return $timeout(2000).then(() => vm.confirmDestroy = false);
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