'use strict';

(function () {

  angular.module('Models').run(function (Schema) {

    Schema.register({

      name: 'Picture',

      relations: {},

      computed: {
        srcThumbnail: ['thumbnailHref', thumbnailHref => thumbnailHref],
        srcFullscreen: ['href', href => href]
      },

      methods: {
        title
      }

    });


    function title() {

      let {ownerXid, target} = this;

      if (!ownerXid || !target) {
        return;
      }

      const targetModel = Schema.model(target);

      if (!targetModel) return;

      const targetInstance = targetModel.get(this.ownerXid);

      if (!targetInstance) return;

      switch (this.target) {
        case 'Person': {
          return targetInstance.name;
        }
      }

    }

  });

})();
