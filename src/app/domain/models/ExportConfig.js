'use strict';

(function () {

  angular
    .module('webPage')
    .constant('ExportConfig', {

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
          title: 'Butas',
          property: 'servicePoint.apartment'
        }, {
          title: 'Durų kodas',
          property: 'servicePoint.doorCode'
        }, {
          title: 'Sistema',
          property: 'filterSystem.name'
        }, {
          title: 'Garantija iki',
          property: 'guaranteeEnd',
          type: 'date',
          format: 'yyyy.mm.dd',
          maxLength: 15
        }, {
          title: 'Paskutinis apt.',
          property: 'lastServiceDate',
          type: 'date',
          format: 'yyyy.mm.dd',
          maxLength: 15
        }, {
          title: 'Sistemos pastabos',
          property: 'serviceItem.info',
          maxLength: 30
        }, {
          title: 'Taško pastabos',
          property: 'servicePoint.info',
          maxLength: 30
        }, {
          title: 'Dovanos',
          property: 'servicePoint.gifts'
        }, {
          title: 'Kaina',
          property: 'servicePrice',
          type: 'number'
        }
      ]

    });

})();
