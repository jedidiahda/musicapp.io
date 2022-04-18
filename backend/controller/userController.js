const moment = require('moment');
const User = require('../models/user');


exports.login = (req,res,next) => {
  const { username, password } = req.body;
  let user = User.getUser(username);

  if(!user){
    throw new Error('Invalid Username');
  }

  if(user.password !== password){
    throw new Error('Invalid Password');
  }

  let session = `${user.username},${moment()}`;


  res.status(200).json({
    session: session
  });
}
