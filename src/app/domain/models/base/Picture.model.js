'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Picture',

      relations: {

      },

      computed: {
        srcThumbnail: ['thumbnailHref', thumbnailHref => thumbnailHref],
        srcFullscreen: ['href', href => href]
      },

      methods: {
        title
      }

    });


    function title() {
      const {Person} = Schema.models();
      if (this.ownerXid) {
        return _.get(Person.get(this.ownerXid), 'name');
      }
    }

  });

})();
