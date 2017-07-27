'use strict';

(function () {

  angular.module('webPage')
    .service('Editing', Editing);

  function Editing($uibModal, $timeout) {

    return {editModal, setupController};

    function setupController(vm) {

      _.assign(vm, {
        saveClick,
        cancelClick,
        destroyClick,
        afterSave: vm.afterSave || _.noop,
        afterCancel: vm.afterCancel || _.noop
      });

      /*
       Functions
       */

      function saveClick() {
        if (vm.saveFn) {
          vm.saveFn()
            .then(vm.afterSave);
        } else if (_.isFunction(vm.item.DSCreate)) {
          vm.item.DSCreate()
            .then(vm.afterSave);
        }
      }

      function cancelClick() {
        vm.afterCancel();
      }

      function destroyClick() {

        vm.confirmDestroy = !vm.confirmDestroy;

        if (vm.confirmDestroy) {
          return $timeout(2000).then(() => vm.confirmDestroy = false);
        }

        if (_.isFunction(vm.item.DSDestroy)) {
          vm.item.DSDestroy()
            .then(vm.afterSave);
        } else {
          vm.afterSave();
        }

      }

    }

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

        setupController(vm);

        _.assign(vm, {
          item,
          title,
          afterSave: modal.close,
          afterCancel: modal.dismiss
        });


      }

    }

  }

})();