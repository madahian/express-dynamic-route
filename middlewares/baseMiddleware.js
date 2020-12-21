const auth = require('./authorization');

module.exports = (routerItem) => {
  return (req, res, next) => {
    req.routerData = routerItem;
    if (routerItem.auth === true) {
      auth(req, res, next);
    } else {
      next();
    }
  };
};
