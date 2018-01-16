'use strict';

/* global ArrayBuffer:false Uint8Array:false saveAs:false */

(function () {

  function FileSaver() {

    return {
      saveWorkBookAs: (wb, name) => {
        return saveAs(new Blob([s2ab(wb)], {type: 'application/octet-stream'}), name);
      }
    };

    function s2ab(s) {

      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);

      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;

      return buf;

    }

  }

  angular.module('sistemium.services')
    .service('FileSaver', FileSaver);

})();
