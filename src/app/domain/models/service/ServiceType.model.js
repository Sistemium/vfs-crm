(function () {

  angular.module('Models').run(function (Schema, $q) {

    const ServiceType = Schema.register({

      name: 'ServiceType',

      relations: {},

      methods: {},

      meta: {},

      findAll() {
        return $q.resolve([]);
      },

    });

    ServiceType.findAll = () => $q.resolve(ServiceType.getAll());

    ServiceType.inject({
      id: 1,
      name: 'Pusmetinis',
    });

    ServiceType.inject({
      id: 2,
      name: 'Metinis',
    })

  });

})();