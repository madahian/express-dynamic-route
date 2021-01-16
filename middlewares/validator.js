const Validator = require('validatorjs');
Validator.useLang('en');

module.exports = async (req, res, next) => {
  if (req.routerData.rules && Object.keys(req.routerData.rules).length !== 0) {
    let validation = new Validator(req.body, req.routerData.rules);
    validation.fails(() => {
      validation.errors.status = 'validationError';
      return next(validation.errors);
    });
  }
  next();
};
