const excludedFields = [
  'direction',
  'sortBy',
  'page',
  'perPage',
  'filter',
  'from',
  'to',
  'tag',
  'advSearch',
  'password',
  'isTrashed',
  'section',
  'parent',
  'isVerified',
];

module.exports = {
  conditions: (req, qb, data) => {
    if (data.where) {
      if (data.orWhere) {
        qb.orWhere(data.where).orWhere(data.orWhere);
      } else {
        qb.andWhere(data.where);
      }
    }
  },
  filter: (req, qb, data) => {
    if (req.query.filter && data.filter) {
      for (const item of data.filter) {
        qb.orWhere(`${item}`, 'like', `%${req.query.filter}%`);
      }
    }
  },
  filterByDate: (req, qb, data) => {
    if (req.query.from && req.query.to && data.filterByDate) {
      qb.andWhereRaw(
        `${data.filterByDate} BETWEEN '${req.query.from}' AND '${req.query.to}'`
      );
    }
  },
  advSearch: (req, qb) => {
    if (req.query.advSearch === 'true') {
      let queryObj = { ...req.query };
      excludedFields.forEach((element) => {
        delete queryObj[element];
      });
      for (const property in queryObj) {
        qb.andWhere(`${property}`, 'like', `%${queryObj[property]}%`);
      }
    }
  },
};
