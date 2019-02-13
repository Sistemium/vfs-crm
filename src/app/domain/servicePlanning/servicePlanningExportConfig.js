'use strict';

(function () {

  angular.module('webPage')
    .constant('servicePlanningExportConfig', {

      ServicePlanning: [
        {
          title: 'Klientas',
          property: 'customer.name'
        }, {
          title: 'Kontaktai',
          property: 'contacts',
          maxLength: 15
        }, {
          title: 'Apskritis',
          property: 'servicePoint.locality.district.name'
        }, {
          title: 'Adresas',
          property: 'servicePoint.address',
          maxLength: 35
        }, {
          title: 'Butas (DK)',
          property: 'apartmentAndDoorCode'
        }, {
          title: 'Sistema',
          property: 'filterSystem.name'
        }, {
          title: 'Garantija iki',
          property: 'guaranteeEnd',
          type: 'date',
          format: 'yyyy-mm-dd',
          maxLength: 15
        }, {
          title: 'Paskutinis apt.',
          property: 'lastServiceDate',
          type: 'date',
          format: 'yyyy-mm-dd',
          maxLength: 15
        }, {
          title: 'X',
          property: 'serviceFrequency',
          type: 'number',
          style: {
            alignment: {horizontal: 'center'}
          }
        }, {
          title: 'Papildomas aptarnavimas',
          property: 'additionalServiceInfo',
          maxLength: 30
        }, {
          title: 'Pastabos',
          property: 'serviceItemPointInfo',
          maxLength: 30
        // }, {
        //   title: 'Dovanos',
        //   property: 'servicePoint.gifts'
        }, {
          title: 'Kaina',
          property: 'servicePrice',
          type: 'number'
        }, {
          title: 'Apt. data',
          maxLength: 30
        }
      ]

    });

})();
