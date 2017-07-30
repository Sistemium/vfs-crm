'use strict';

(function () {

  angular.module('webPage')
    .service('Editing', Editing);

  function Editing($uibModal, $timeout) {

    return {editModal, setupController};

    function setupController(vm, itemProperty) {

      itemProperty = itemProperty || 'item';

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
        } else if (_.isFunction(vm[itemProperty].DSCreate)) {
          vm[itemProperty].DSCreate()
            .then(vm.afterSave);
        }
      }

      function cancelClick(ev) {
        vm.afterCancel(ev);
      }

      function destroyClick() {

        vm.confirmDestroy = !vm.confirmDestroy;

        if (vm.confirmDestroy) {
          return $timeout(2000).then(() => vm.confirmDestroy = false);
        }

        if (_.isFunction(vm[itemProperty].DSDestroy)) {
          vm[itemProperty].DSDestroy()
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

      let itemName = _.last(componentName.match(/edit-(.*)/));

      let modal = $uibModal.open({

        animation: true,
        template: `<div class="modal-header"><h1>{{vm.title}}</h1></div>` +
        `<div class="modal-body">` +
        `  <${componentName} ${itemName}="vm.item" save-fn="vm.saveFn"></${componentName}>` +
        `</div>` +
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