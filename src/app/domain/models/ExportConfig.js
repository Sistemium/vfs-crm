'use strict';

(function () {

  angular
    .module('webPage')
    .constant('ExportConfig', {

      ServicePlanning: [
        {
          title: 'Klientas',
          property: 'customerName'
        }, {
          title: 'Adresas',
          property: 'serviceItem.servicePoint.address'
        }, {
          title: 'Sistema',
          property: 'serviceItem.filterSystem.name'
        }, {
          title: 'Paskutinis apt.',
          property: 'lastServiceDateLT',
          type: 'date',
          format: 'yyyy.mm.dd'
        }, {
          title: 'Dovanos',
          property: 'serviceItem.servicePoint.gifts'
        }, {
          title: 'Kaina',
          property: 'servicePrice',
          type: 'number'
        }
      ]

    });

})();
