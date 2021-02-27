const knex = require('knex')(require('../config/config').knex_config);
const error = require('../util/errorCreator');
const fs = require('fs');
const queryFunctions = require('../util/queryFunctions');

const model = {
  async first(data) {
    data.functionName = 'first';
    data.orderBy = 'id';
    let spcFnc = await model.callHelperIfExist(data);
    if (spcFnc === false) {
      let selection = '*';
      if (
        data.selection &&
        Array.isArray(data.selection) &&
        data.selection.every((el) => typeof el === 'string')
      )
        selection = data.selection;
      const doc = (
        await knex.select(selection).from(data.tableName).where(data.fields)
      )[0];
      if (!doc) return next(new error('Not found!', 404));
      return doc;
    } else {
      return spcFnc;
    }
  },
  async find(req, data) {
    data.functionName = 'find';
    let spcFnc = await model.callHelperIfExist(data, req);
    if (spcFnc === false) {
      let selection = '*';
      if (
        data.selection &&
        Array.isArray(data.selection) &&
        data.selection.every((el) => typeof el === 'string')
      )
        selection = data.selection;
      let resObj = {};
      const getModel = () =>
        knex
          .table(data.tableName)
          .andWhere(function () {
            queryFunctions.filter(req, this, data);
          })
          .andWhere(function () {
            queryFunctions.conditions(req, this, data);
          })
          .andWhere(function () {
            queryFunctions.advSearch(req, this);
          })
          .andWhere(function () {
            queryFunctions.filterByDate(req, this, data);
          });
      resObj.results = (await getModel().clone().count())[0]['count(*)'];
      if (data.paginate === undefined || data.paginate === true) {
        data.sortBy = req.query.sortBy || `${data.tableName}.id`;
        data.direction = req.query.direction || 'desc';
        data.page = req.query.page || '1';
        data.perPage = req.query.perPage || '10';
        let offset = data.perPage * (data.page - 1);
        resObj.data = await getModel()
          .clone()
          .offset(offset)
          .limit(data.perPage)
          .orderBy(data.sortBy, data.direction)
          .select(selection);
      } else if (data.paginate === false) {
        resObj.data = await getModel().clone().select(selection);
      }
      return resObj;
    } else {
      return spcFnc;
    }
  },
  async update(data) {
    data.functionName = 'update';
    let spcFnc = await model.callHelperIfExist(data);
    if (spcFnc === false) {
      await this.first({ tableName: data.tableName, fields: { id: data.id } });
      let dbRes = await knex(data.tableName)
        .update(data.fields)
        .where('id', data.id);
      return dbRes;
    } else {
      return spcFnc;
    }
  },
  async insert(data) {
    data.functionName = 'insert';
    let spcFnc = await model.callHelperIfExist(data);
    if (spcFnc === false) {
      return await knex(data.tableName).insert(data.fields);
    } else {
      return spcFnc;
    }
  },
  async delete(data) {
    data.functionName = 'delete';
    let spcFnc = await model.callHelperIfExist(data);
    if (spcFnc === false) {
      await this.first({ tableName: data.tableName, fields: { id: data.id } });
      await knex(data.tableName).where(data.fields).del();
    } else {
      return spcFnc;
    }
  },
  async findWithJoin(req, data) {
    data.functionName = 'findWithJoin';
    let spcFnc = await model.callHelperIfExist(data, req);
    if (spcFnc === false) {
      let resObj = {};
      let selection = '*';
      if (
        data.selection &&
        Array.isArray(data.selection) &&
        data.selection.every((el) => typeof el === 'string')
      )
        selection = data.selection;
      const getModel = () =>
        knex
          .table(data.tableName)
          .join(data.secTableName, data.firstProp, '=', data.secProp)
          .andWhere(function () {
            queryFunctions.filter(req, this, data);
          })
          .andWhere(function () {
            queryFunctions.conditions(req, this, data);
          })
          .andWhere(function () {
            queryFunctions.advSearch(req, this);
          })
          .andWhere(function () {
            queryFunctions.filterByDate(req, this, data);
          });
      resObj.results = (await getModel().clone().count())[0]['count(*)'];
      if (data.paginate === undefined || data.paginate === true) {
        data.sortBy = req.query.sortBy || `${data.tableName}.id`;
        data.direction = req.query.direction || 'desc';
        data.page = req.query.page || '1';
        data.perPage = req.query.perPage || '10';
        let offset = data.perPage * (data.page - 1);
        resObj.data = await getModel()
          .clone()
          .offset(offset)
          .limit(data.perPage)
          .orderBy(data.sortBy, data.direction)
          .select(selection);
      } else if (data.paginate === false) {
        resObj.data = await getModel().clone().select(selection);
      }
      return resObj;
    } else {
      return spcFnc;
    }
  },

  async callHelperIfExist(data, req) {
    let filePath = 'service/helpers/' + data.tableName + '.js';
    if (fs.existsSync(filePath)) {
      const helper = require('./helpers/' + data.tableName);

      if (req) {
        if (helper[data.functionName]) {
          return helper[data.functionName](req, data);
        }
      } else {
        if (helper[data.functionName]) {
          return helper[data.functionName](data);
        }
      }
    }
    return false;
  },
};

module.exports = model;
