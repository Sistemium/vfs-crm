'use strict';

(function () {

  angular.module('sistemiumBootstrap.directives')
    .component('sabConfirmButtons', {

      bindings: {
        form: '=',
        onCancelFn: '&onCancel',
        onSubmitFn: '&onSubmit',
        submitLabel: '@',
        cancelLabel: '@',
        cancelNoLabel: '@',
        submitDisable: '&'
      },

      templateUrl: 'app/components/sabConfirmButtons/sabConfirmButtons.html',
      controller: sabConfirmButtonsController,
      controllerAs: 'vm'

    });

  function sabConfirmButtonsController() {

    var vm = _.defaults(this,{
      submitLabel: 'Сохранить',
      cancelLabel: 'Отменить',
      cancelNoLabel: 'Нет'
    });

    function onCancel () {
      var fn = vm.onCancelFn();
      return _.isFunction(fn) && fn(vm.form);
    }

    function onSubmit () {
      var fn = vm.onSubmitFn();
      return _.isFunction(fn) && fn(vm.form);
    }

    _.assign(vm, {

      isSubmitDisabled: () => vm.submitDisable(),

      submitClick: function () {
        onSubmit();
      },

      cancelClick: function () {
        if (vm.form && vm.form.$pristine) {
          onCancel()
        } else {
          vm.isInCancelProcess = true;
        }
      },

      cancelConfirmClick: function () {
        onCancel();
      }

    });

  }

})();
