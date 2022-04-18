const express = require('express');
const NotFoundError = require('../errors/not-found-error');

module.exports.currentUser = (req,res,next) => {
  if(!req.body.userSession){
    throw new NotFoundError();
  }

  next();
}