const { Router } = require('express');
const router = Router();
const baseController = require('../controller/baseController');
const baseMiddleware = require('../middlewares/baseMiddleware');
const validator = require('../middlewares/validator');
const fs = require('fs');

const routesDIR = './routes/';
const scanRoutesDIR = (router) => {
  const routesList = fs.readdirSync(routesDIR);
  routesList.forEach((item) => {
    item = item.replace('.js', '');
    const routerData = require('.' + routesDIR + item);
    registerRoutes(item, routerData, router);
  });
};
const rootAPI = '/api/v1/';
const registerRoutes = (basePath, routerData, router) => {
  routerData.forEach((routerItem) => {
    routerItem.basePath = basePath;
    if (routerItem.method === 'get') {
      router.get(
        rootAPI + basePath + routerItem.name,
        baseMiddleware(routerItem),
        validator,
        baseController.get
      );
    } else if (routerItem.method === 'post') {
      router.post(
        rootAPI + basePath + routerItem.name,
        baseMiddleware(routerItem),
        validator,
        baseController.post
      );
    } else if (routerItem.method === 'put') {
      router.put(
        rootAPI + basePath + routerItem.name,
        baseMiddleware(routerItem),
        validator,
        baseController.put
      );
    } else if (routerItem.method === 'delete') {
      router.delete(
        rootAPI + basePath + '/' + routerItem.name,
        baseMiddleware(routerItem),
        validator,
        baseController.delete
      );
    }
  });
};
scanRoutesDIR(router);

module.exports = router;
