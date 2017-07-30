'use strict';

(function (module) {

  module.service('PictureHelper', PictureHelper);

  function PictureHelper(Upload, moment) {

    let imsUrl = 'https://api.sistemium.com/ims/vfsd';

    const state = this;

    return {onSelect, upload};

    function onSelect(file, instance) {

      if (!file) return;

      return upload(file)
        .then(imsData => {

          let picturesInfo = imsData.pictures;
          let href = _.get(_.find(picturesInfo, {name: 'largeImage'}), 'src');
          let thumbnailHref = _.get(_.find(picturesInfo, {name: 'thumbnail'}), 'src');

          _.assign(instance, {picturesInfo, href, thumbnailHref});

          instance.DSCreate();

        });

    }

    function upload(file, folder) {

      state.uploading = {};

      folder = `${folder}/${moment().format('YYYY/MM/DD')}`;

      return Upload.upload({
        url: imsUrl,
        data: {file, folder},
        headers: {
          // 'Authorization': Auth.getAccessToken()
        }
      })
        .progress(progress => {
          state.uploading && _.assign(state.uploading, _.pick(progress, ['loaded', 'total']));
        })
        .then(imsResponse => {
          state.uploading = false;
          state.file = file;
          return imsResponse.data;
        })
        .catch(err => {
          console.error(err);
          state.uploading = false;
        });

    }

  }

})(angular.module('webPage'));
