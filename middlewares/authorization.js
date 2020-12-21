const jwt = require('jsonwebtoken');
const AppError = require('../util/errorCreator');
const baseService = require('../service/baseService');

module.exports = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token)
    return next(
      new AppError(
        'You have not access to this!, please log in or sign up...',
        401
      )
    );
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    const user = await baseService.first({
      tableName: 'users',
      fields: { id: decoded.id },
    });
    req.user = {
      id: user.id,
      role: user.role,
    };
    next();
  } catch (e) {
    return next(e);
  }
};
