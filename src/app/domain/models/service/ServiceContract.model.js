'use strict';

(function () {

  angular.module('Models').run(function (Schema, $rootScope) {

    // 'num,code;date',
    // 'Person,customerPerson,nullable;LegalEntity,customerLegalEntity,nullable;Site'
    // -- Either customerPerson or customerLegalEntity is not null
    // -- Either customerPerson or customerLegalEntity is null

    const ServiceContract = Schema.register({

      name: 'ServiceContract',

      relations: {

        hasOne: {

          Person: {
            localField: 'customerPerson',
            localKey: 'customerPersonId'
          },

          LegalEntity: {
            localField: 'customerLegalEntity',
            localKey: 'customerLegalEntityId'
          },

          Site: {
            localField: 'site',
            localKey: 'siteId'
          }

        },

        hasMany: {
          ServicePoint: {
            localField: 'servicePoints',
            foreignKey: 'currentServiceContractId'
          }
        }

      },

      computed: {

        legalType: ['customerPersonId', 'customerLegalEntityId', legalType],
        name: ['date', 'num', name]

      },

      methods: {

        customer,
        isValid

      },

      meta: {
        label: {
          add: 'Naujas sutartis'
        },
        noDefault: true
      }

    });

    $rootScope.$watch(ifCustomerChanged, recalculateNames);

    /*
     Functions
     */

    function recalculateNames() {
      _.each(ServiceContract.getAll(), item => {
        ServiceContract.compute(item.id);
      });
    }

    function ifCustomerChanged() {
      return `${Schema.model('Person').lastModified()}|${Schema.model('LegalEntity').lastModified()}`;
    }

    function isValid(data) {
      return this.date && (this.siteId ||_.get(data, 'siteId.ready')) && this.num &&
        legalType(
          this.customerPersonId || _.get(data, 'customerPersonId.ready'),
          this.customerLegalEntityId || _.get(data, 'customerLegalEntityId.ready')
        );
    }

    function customer() {

      if (!this.legalType) return null;

      return this.legalType === 'Asmuo' ? this.customerPerson : this.customerLegalEntity;

    }

    function legalType(customerPersonId, customerLegalEntityId) {
      return customerPersonId && 'Asmuo' || customerLegalEntityId && 'Įmonė' || null;
    }

    function name(date, num) {

      //TODO: fix this.customer().name

      if (!date || !num || !this.customer()) return this.name || null;
      return `${this.customer().name} №${num} nuo ${date}`;
    }

  });

})();
