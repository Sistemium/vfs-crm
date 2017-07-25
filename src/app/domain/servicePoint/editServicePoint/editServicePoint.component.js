(function (module) {

  module.component('editServicePoint', {

    bindings: {
      servicePoint: '=',
      saveFn: '='
    },

    templateUrl: 'app/domain/servicePoint/editServicePoint/editServicePoint.html',
    controller,
    controllerAs: 'vm'

  });

  function controller() {

    //const vm = this;
    //
    //vm.$onInit = function () {
    //  vm.saveFn = save;
    //};
    //
    //function save() {
    //  return Schema.model('ServicePoint').create(vm.servicePoint);
    //}

  }

})(angular.module('webPage'));
