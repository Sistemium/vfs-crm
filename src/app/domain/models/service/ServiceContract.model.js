'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    // 'num,code;date',
    // 'Person,customerPerson,nullable;LegalEntity,customerLegalEntity,nullable;Site'
    // -- Either customerPerson or customerLegalEntity is not null
    // -- Either customerPerson or customerLegalEntity is null

    Schema.register({

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

        }

      },

      computed: {

        legalType: ['customerPersonId', 'customerLegalEntityId', legalType],
        name: ['date', 'num', name]

      },

      methods: {

        customer,
        isValid

      }

    });

    function isValid() {
      return this.date &&
        this.siteId &&
        this.num &&
        legalType(this.customerPersonId, this.customerLegalEntityId);
    }

    function customer() {

      if (!this.legalType) return null;

      return this.legalType === 'Asmuo' ? this.customerPerson : this.customerLegalEntity;

    }

    function legalType(customerPersonId, customerLegalEntityId) {
      return customerPersonId && 'Asmuo' || customerLegalEntityId && 'Įmonė' || null;
    }

    function name(date, num) {
      if (!date || !num) return null;
      return `${num} nuo ${date}`;
    }

  });

})();
