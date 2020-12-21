const fs = require('fs');
const crud = require('./crudOperations');
const catchError = require('../util/catchError');

const controller = {
  get: catchError(async (req, res, next) => {
    const spcFnc = await controller.callHelperIfExist(req, res, next);
    if (spcFnc === false) {
      if (req.params.id) {
        await crud.getItem(req, res, next);
      } else {
        await crud.getList(req, res, next);
      }
    }
  }),
  put: catchError(async (req, res, next) => {
    const spcFnc = await controller.callHelperIfExist(req, res, next);
    if (spcFnc === false) {
      await crud.putItem(req, res, next);
    }
  }),
  post: catchError(async (req, res, next) => {
    const spcFnc = await controller.callHelperIfExist(req, res, next);
    if (spcFnc === false) {
      await crud.postItem(req, res, next);
    }
  }),
  delete: catchError(async (req, res, next) => {
    const spcFnc = await controller.callHelperIfExist(req, res, next);
    if (spcFnc === false) {
      await crud.deleteItem(req, res, next);
    }
  }),
  callHelperIfExist: async (req, res, next) => {
    let filePath = 'controller/helpers/' + req.routerData.basePath + '.js';
    if (fs.existsSync(filePath)) {
      const helper = require('./helpers/' + req.routerData.basePath);
      let fncName = req.routerData.name.replace(':', '_');
      fncName = fncName.split('/').join('');
      fncName = fncName + req.routerData.method.toUpperCase();
      if (helper[fncName]) {
        return helper[fncName](req, res, next);
      }
    }
    return false;
  },
};
module.exports = controller;
