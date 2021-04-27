'use strict';

(function () {

  angular.module('webPage').service('ServicePlanningService', ServicePlanningService);

  function ServicePlanningService(Schema, $filter, $q) {

    const LT_PHONE = $filter('ltphone');

    const {
      // ServicePlanning, Person, FilterSystem, Brand, ServicePoint,
      // ServiceItem, ServiceContract, LegalEntity,
      // Site, District,
      Employee, ServiceItemService,
    } = Schema.models('');

    return {

      dateFilter(filter, monthDate) {

        const date = moment(monthDate);

        if (!date.isValid()) {
          return;
        }

        const dateB = date.format();

        const monthEnd = date.add(1, 'month').add(-1, 'day');

        const dateE = monthEnd.format();

        return _.assign({ dateB, dateE }, filter);

      },

      exportData(data, monthDate) {

        return _.map(data, item => {

          const { serviceItem, serviceFrequency } = item;
          const { filterSystem, servicePoint, installingDate } = serviceItem;
          const { serviceInfo, additionalServiceInfo } = serviceItem;
          const { filterSystemType } = filterSystem;
          const { currentServiceContract, servicePointContacts } = servicePoint;

          const { lastServiceDate = item.lastServiceDate } = serviceItem;

          const servicePrice = serviceItem.servicePrice ||
            filterSystem.servicePrice ||
            filterSystemType.servicePrice;

          const guaranteePeriod = serviceItem.guaranteePeriod ||
            filterSystem.guaranteePeriod ||
            filterSystemType.guaranteePeriod;

          let guaranteeEnd = installingDate &&
            moment(installingDate).add(guaranteePeriod, 'months').toDate();

          let customer = currentServiceContract.customer();
          let allPhones = _.clone(customer.allPhones()) || [];

          _.each(servicePointContacts, contact => {
            allPhones.push(...contact.person.allPhones());
          });

          let contacts = _.map(allPhones, phone => _.replace(LT_PHONE(phone.address), /[ ]/g, '')).join(' ');

          let { apartment, doorCode } = servicePoint;
          let apartmentAndDoorCode = apartment &&
            `${apartment}${doorCode ? ' (' + doorCode + ')' : ''}`;

          let serviceItemPointInfo = _.filter([serviceInfo, additionalServiceInfo]).join('\n');

          return _.defaults({

            lastServiceDate: lastServiceDate && moment(lastServiceDate).toDate(),
            installingDate,
            guaranteeEnd: {
              val: guaranteeEnd,
              style: {
                font: { strike: guaranteeEnd < monthDate }
              }
            },
            apartmentAndDoorCode,
            serviceFrequency,
            servicePoint,
            serviceItem,
            filterSystem,
            customer,
            servicePrice,
            contacts,
            serviceItemPointInfo

          }, item);

        });

      },

      groupByServingMaster(servicePlannings, serviceFilter) {

        let groups = _.groupBy(_.filter(servicePlannings, 'servingMasterId'), 'servingMasterId');
        const res = [];

        let busy = [];

        let services = ServiceItemService.filter(serviceFilter);

        let servicesByItem = _.keyBy(services, 'serviceItemId');

        _.each(groups, (dataUnsorted, servingMasterId) => {

          const data = _.orderBy(dataUnsorted, ({ serviceItem, nextServiceDate }) => ([
            _.get(serviceItem, 'servicePoint.locality.district.name'),
            _.get(_.result(serviceItem, 'servicePoint.currentServiceContract.customer'), 'name'),
            nextServiceDate,
          ]));

          _.each(data, item => {

            const { serviceItem } = item;
            const { servicePoint } = serviceItem;

            item.service = servicesByItem[item.id];
            item.serviceStatus = item.serviceStatusCode();

            const servicePointContacts = $q.when()
            //servicePoint.DSLoadRelations('ServicePointContact')
              .then(() => {
                const { currentServiceContract } = servicePoint;
                if (!currentServiceContract) {
                  return;
                }
                busy.push(currentServiceContract.customer().contactsLazy());
                return $q.all(_.map(servicePoint.servicePointContacts, ({ person }) => person.contactsLazy()));
              })
              .then(() => {
                item.contacts = servicePoint.allContacts();
              });

            busy.push(servicePointContacts);

          });

          res.push({
            cls: 'group',
            id: servingMasterId,
            servingMaster: Employee.get(servingMasterId),
            data
          });

          res.push(...data);

        });

        return $q.all(busy).then(() => res);

      }

    };

  }

})();
