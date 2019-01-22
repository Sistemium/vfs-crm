'use strict';

(function () {

  angular.module('webPage')
    .service('Editing', Editing);

  function Editing($uibModal, $timeout, Schema, $q) {

    let me = this;

    return {editModal, setupController, closeModal};

    function setupController(vm, itemProperty) {

      itemProperty = itemProperty || 'item';

      _.assign(vm, {
        saveClick,
        cancelClick,
        destroyClick,
        saveFormDataClick,
        afterSave: vm.afterSave || _.identity,
        afterCancel: vm.afterCancel || _.identity
      });

      /*
       Functions
       */

      function saveFormDataClick() {

        $q.all(saveFormData(vm.readyState))
          .then(saveComponent)
          .then(() => postSave(vm.readyState))
          .then(vm.afterSave)
          .catch(err => console.error(err));

      }

      function postSave(readyStateObj) {
        const res = _.map(readyStateObj, (val) => {

          if (val && val.postSave) {
            return val.postSave();
          }

          if (!val || _.isEmpty(val)) {
            return $q.resolve(val);
          }

          return postSave(val);

        });
        return $q.all(res);
      }

      function saveFormData(readyStateObj) {

        return _.map(readyStateObj, (val, key) => {

          if (val === true || _.isFunction(val)) {
            return $q.resolve(key);
          }

          if (_.isEmpty(val)) {
            return $q.resolve(key);
          } else {
            return $q.all(saveFormData(val))
              .then(() => val.save && val.save());
          }

        });

      }

      function saveClick() {
        return saveComponent()
          .then(vm.afterSave);
      }

      function saveComponent() {

        if (vm.saveFn) {
          return vm.saveFn();
        }

        if (_.isFunction(vm[itemProperty].DSCreate)) {
          return vm[itemProperty].DSCreate();
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

      me.modal = $uibModal.open({

        animation: true,
        templateUrl: 'app/domain/components/editing/editing.modal.html',
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
          editingEnabled: /show/.test(componentName),
          editing: /edit/.test(componentName),
          componentName,
          readyState: {}
        };

        $scope.vm = vm;

        $scope.$on('$stateChangeSuccess', closeModal);

        $scope.$watch('vm.editing', onEditing);

        setupController(vm);

        _.assign(vm, {
          item,
          title,
          afterSave: me.modal.close,
          afterCancel: me.modal.dismiss,
          isReady,
          hasChanges
        });

        function onEditing(editing, oldEditing) {
          if (editing && !oldEditing) {
            vm.componentName = _.replace(vm.componentName, 'show', 'edit');
          } else if (!editing && oldEditing) {
            vm.componentName = _.replace(vm.componentName, 'edit', 'show');
          }
        }

        function hasChanges() {

          if (vm.componentHasChanges) {
            return vm.componentHasChanges();
          }

          if (!vm.item.id) {
            return true;
          }

          return vm.item.DSHasChanges() || _.find(vm.readyState, val => !_.isFunction(val) && !_.isEmpty(val));

        }

        // function readyStateHasChanges(readyState) {
        //   return _.find(readyState, val => {
        //
        //     if (_.isFunction(val) || _.isEmpty(val)) {
        //       return false;
        //     }
        //
        //   });
        // }

        function isReady(property) {

          if (vm.componentIsValid && !vm.componentIsValid()) {
            return false;
          }

          let isValidForm = _.every(property || vm.readyState, (value, key) => {
            if (key === 'ready' && value === false) {
              return false;
            }

            if (_.isObject(value)) {
              return isReady(value);
            }

            return true;

          });

          return isValidForm && vm.item.isValid(vm.readyState);

        }

      }

    }

  }

})();