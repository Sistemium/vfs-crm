'use strict';

require('sistemium-gulp')
  .config({
    ngModule: 'webPage',
    browserSync: {
      port: 3100,
      ui: {
        port: 3101
      },
      ghostMode: false,
      reloadOnRestart: false,
    }
  })
  .run(require('gulp'));
