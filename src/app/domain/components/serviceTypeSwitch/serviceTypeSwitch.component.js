(function () {

  angular.module('webPage')
    .component('serviceTypeSwitch', {

      bindings: {
        type: '=ngModel',
      },

      templateUrl: 'app/domain/components/serviceTypeSwitch/serviceTypeSwitch.html',
      controllerAs: 'vm',

      controller: serviceTypeSwitchController,

    });

  function serviceTypeSwitchController(Schema) {
    const types = ['service', 'forward', 'pause', 'other'];
    const { ServiceItemService } = Schema.models();
    _.assign(this, {
      items: _.map(types, type => ({
        type, cls: ServiceItemService.meta.typeIcon(type)
      })),
    });
  }

})();