const User = require('../models/user');

currentUser = (req,res,next) => {
  const token = req.query.token ? req.query.token : req.body.token;
  const userToken = token && token.split(',')[0];
  if(!User.getUser(userToken)){
    throw new Error('Invalid credential');
  }

  next();
}

module.exports = currentUser;