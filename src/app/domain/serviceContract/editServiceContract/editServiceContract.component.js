(function (module) {

  module.component('editServiceContract', {

    bindings: {
      serviceContract: '=ngModel',
      readyState: '='
    },

    templateUrl: 'app/domain/serviceContract/editServiceContract/editServiceContract.html',
    controller: editServiceContract,
    controllerAs: 'vm'

  });

  function editServiceContract($scope, ReadyStateHelper, Schema, $state) {

    const config = {

      $onInit() {

        const { serviceContract } = this;
        const { Brand, FilterSystemType, FilterSystem, Site } = Schema.models();


        if (!serviceContract.id && serviceContract.hasOwnProperty('siteId')) {
          this.hideSite = true;
        } else if (serviceContract && !serviceContract.id) {
          serviceContract.siteId = _.get(Site.meta.getCurrent(), 'id');
          this.hideSite = true;
        }

        serviceContract.DSCompute();
        this.legalType = serviceContract.legalType;

        const types = [
          'vm.legalType',
          'vm.serviceContract.customerPersonId',
          'vm.serviceContract.customerLegalEntityId'
        ];

        $scope.$watchGroup(types, ([legalType, personId, legalEntityId]) => {
          if (legalType === 'Asmuo' && personId) {
            this.serviceContract.customerLegalEntityId = null;
          } else if (legalType === 'Įmonė' && legalEntityId) {
            this.serviceContract.customerPersonId = null;
          }
        });

        this.serviceContract.DSLoadRelations()
          .then(serviceContract => {
            return _.map(serviceContract.servicePoints, servicePoint => {
              return servicePoint.DSLoadRelations();
            });
          })
          .then(() => {
            Brand.findAll();
            FilterSystemType.findAll();
            FilterSystem.findAll();
          });

      },

      servicePointClick(item) {
        $state.go('servicePoint.detailed', { servicePointId: item.id }, { reload: true });
      }

    };

    ReadyStateHelper.setupController(this, $scope, 'serviceContract')
      .use(config)

  }

})(angular.module('webPage'));
