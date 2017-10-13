'use strict';

(function () {

  angular.module('webPage')
    .service('Editing', Editing);

  function Editing($uibModal, $timeout, Schema) {

    let me = this;

    return {editModal, setupController, closeModal};

    function setupController(vm, itemProperty) {

      itemProperty = itemProperty || 'item';

      _.assign(vm, {
        saveClick,
        cancelClick,
        destroyClick,
        afterSave: vm.afterSave || _.identity,
        afterCancel: vm.afterCancel || _.identity
      });

      /*
       Functions
       */

      function saveClick() {

        //:TODO check vm.readyState recursively

        if (vm.saveFn) {
          return vm.saveFn()
            .then(vm.afterSave);
        } else if (_.isFunction(vm[itemProperty].DSCreate)) {
          return vm[itemProperty].DSCreate()
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
      return item => {

        if (!title) {

          let modelName = _.get(item, 'constructor.name');

          let model = modelName && Schema.model(modelName);

          if (!item.id) {
            title = _.get(model, 'meta.label.add');
          }

        }

        return openEditModal(item, componentName, title);

      };
    }

    function closeModal() {
      me.modal.close();
    }

    function openEditModal(item, componentName, title) {

      //let itemName = _.last(componentName.match(/edit-(.*)/));

      me.modal = $uibModal.open({

        animation: true,
        template: `<div class="editing modal-header">` +
        `  <h1>{{vm.title}}</h1>` +
        `  <a href class="close-btn" ng-click="vm.cancelClick()"><i 
class="glyphicon glyphicon-remove"></i></a>` +
        `</div>` +
        `<div class="modal-body">` +
        `  <pre>{{vm.readyState | json}}</pre>` +
        ` <${componentName} ng-model="vm.item" save-fn="vm.saveFn" ready-state="vm.readyState"></${componentName}>` +
        `</div>` +
        `<div class="modal-footer">` +
        (item.id ? `  <button class="btn destroy" ng-class="vm.confirmDestroy ? 'btn-danger' : 'btn-default'" ng-click="vm.destroyClick()">Ištrinti</button>` : '') +
        `  <button class="btn btn-success save animate-show" ng-show="vm.hasChanges()" ng-disabled="!vm.isReady()" ng-click="vm.saveClick()">Išsaugoti</button>` +
        `  <button class="btn btn-default cancel" ng-click="vm.cancelClick()">Atšaukti</button>` +
        `</div>`,
        size: 'lg',

        controller,

        backdrop: 'static'

      });

      me.modal.result
        .catch(() => {
          if (item.id) {
            item.DSRevert();
          }
        });

      return me.modal.result;

      function controller($scope) {

        const vm = {
          readyState: {}
        };

        $scope.vm = vm;

        setupController(vm);

        _.assign(vm, {
          item,
          title,
          afterSave: me.modal.close,
          afterCancel: me.modal.dismiss,
          isReady,
          hasChanges
        });

        function hasChanges() {
          return !vm.item.id || vm.item.DSHasChanges() || !_.isEmpty(vm.readyState);
        }

        function isReady(state) {

          return !_.filter(state || vm.readyState, val => {

            if (!val) {
              return true;
            } else if (val === true) {
              return false;
            }

            return !isReady(val.readyState || val);

          }).length && vm.item.isValid();

        }

      }

    }

  }

})();