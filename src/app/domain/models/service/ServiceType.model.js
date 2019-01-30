(function () {

  angular.module('Models').run(function (Schema, $q, $timeout) {

    const ServiceType = Schema.register({

      name: 'ServiceType',

      relations: {},

      methods: {},

      meta: {},

    });

    ServiceType.findAll = () => $q.resolve(ServiceType.getAll());

    $timeout(initData);

    function initData() {

      ServiceType.inject({
        id: 1,
        name: 'Pusmetinis',
      });

      ServiceType.inject({
        id: 2,
        name: 'Metinis',
      });

    }

  });

})();