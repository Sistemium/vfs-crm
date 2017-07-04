'use strict';

(function () {

  angular.module('webPage').service('IosAdapter', function ($window, $timeout, DSUtils, $log, IosParser) {

    var ios = $window.webkit;
    var requests = {};
    var counter = 1;
    var deb = $window.debug('stg:IosAdapter');


    var IosAdapter = function (schema) {

      function iosCallback(name, parser) {
        return function (data, req) {

          var id = req && req.options && req.options.requestId;
          var request = id && requests [id];

          if (request) {

            if (name === 'resolve') {

              if (parser) {
                parser(data, request.message.entity);
              }

              if (_.get(request, 'message.options.oneObject') && angular.isArray(data)) {
                data = data.length ? data[0] : undefined;
              }
            }

            deb(name, req.entity, data);

            request [name](data);
            delete requests [id];
          }

        }
      }

      function iosParser(data, entity) {

        IosParser.parseArray(data, schema.model(entity))

      }

      $window.iSistemiumIOSCallback = iosCallback('resolve', iosParser);

      $window.iSistemiumIOSErrorCallback = iosCallback('reject');

    };

    function jsdParamsToIOSWhere(params) {

      if (params.where) {
        return params.where;
      }
      return _.mapValues(params, function (val) {
        return {
          '==': val
        }
      });
    }

    function requestFromIOS(type, entity, params, options) {

      var id = counter++;

      options.requestId = id;

      var message = {

        entity: entity,
        options: options

      };

      if (angular.isString(params)) {
        message.id = params;
      } else if (type === 'update') {
        message.data = params;
      } else if (params) {
        message.where = jsdParamsToIOSWhere(params);
      }

      var promise = new DSUtils.Promise(function (resolve, reject) {

        requests [id] = {
          promise: promise,
          message: message,
          resolve: resolve,
          reject: reject
        };

        ios.messageHandlers[type].postMessage(message);

      });

      return promise;
    }

    if (!ios) {

      var mock = {
        postMessage: function (req) {
          $log.log(req);
        }
      };

      ios = {
        messageHandlers: {
          findAll: mock,
          find: mock,
          updateAll: mock
        }
      }
    }

    const STAPI_OPTION_ORDER_BY = 'x-order-by:';

    function paramsToOptions(params) {

      let parsed = {};

      _.each(params, (val, key) => {
        if (!_.isFunction(val)) {
          parsed[key] = val;
        }
      });

      if (params.limit) {
        parsed.pageSize = params.limit;
      }

      if (params.startPage) {
        parsed.startPage = params.startPage;
      }

      if (params.offset) {
        parsed.startPage = Math.ceil(params.offset / (params.limit || 1)) + 1;
      }

      let stApiOrder = params[STAPI_OPTION_ORDER_BY];

      if (stApiOrder) {
        let desc = _.startsWith(stApiOrder, '-');
        parsed.sortBy = _.replace(stApiOrder, '-', '');
        if (desc) {
          parsed.directon = 'DESC';
        }
        delete params[STAPI_OPTION_ORDER_BY];
      }

      delete params.limit;
      delete params.offset;

      return parsed;

    }

    IosAdapter.prototype.findAll = function (resource, params, options) {

      options = _.assign(paramsToOptions(options), paramsToOptions(params));

      return requestFromIOS('findAll', resource.endpoint, params, angular.extend({
          pageSize: 1000,
          startPage: 1
        }, options)
      );
    };

    IosAdapter.prototype.find = function (resource, id, options) {
      return requestFromIOS('find',
        resource.endpoint,
        angular.isObject(id) && id.id || id,
        angular.extend(options || {}, {oneObject: true})
      );
    };

    IosAdapter.prototype.create = function (resource, attrs) {
      return requestFromIOS('update', resource.endpoint, attrs, {
        oneObject: true
      });
    };

    IosAdapter.prototype.update = function (resource, id, attrs) {
      return requestFromIOS('update', resource.endpoint, attrs, {
        oneObject: true
      });
    };

    IosAdapter.prototype.destroy = function (resource, id, options) {
      return requestFromIOS('destroy', resource.endpoint, id, options || {});
    };

    //IosAdapter.prototype.updateAll = function (resource, attrs, params, options) {
    //  return requestFromIOS('updateAll', resource.endpoint, {}, {
    //    data: attrs
    //  });
    //};

    return IosAdapter;
  });

})();
