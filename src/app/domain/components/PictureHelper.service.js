'use strict';

(function (module) {

  module.service('PictureHelper', PictureHelper);

  function PictureHelper(Upload, moment, $q) {

    let imsUrl = 'https://api.sistemium.com/ims/vfsd';

    return function () {

      const state = this;

      _.assign(state, {
        onSelect,
        upload
      });

      return state;


      /*
       Functions
       */

      function onSelect(file, instance, folder) {

        if (!file) return $q.reject();

        return upload(file, folder || instance.target)
          .then(imsData => {

            let {pictures} = imsData;
            let href = _.get(_.find(pictures, {name: 'largeImage'}), 'src');
            let thumbnailHref = _.get(_.find(pictures, {name: 'thumbnail'}), 'src');

            _.assign(instance, {picturesInfo: pictures, href, thumbnailHref});

            return instance.DSCreate();

          });

      }

      function upload(file, folder) {

        state.uploading = {};

        folder = `${folder}/${moment().format('YYYY/MM/DD')}`;

        let q = Upload.upload({
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
          });


        q.catch(err => {
          console.error(err);
          state.uploading = false;
        });

        return q;

      }

    }

  }

})(angular.module('webPage'));
