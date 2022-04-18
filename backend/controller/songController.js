const Song = require('../models/song');

exports.getAll = (req,res,next) => {
  res.status(200).json(Song.getAll());
}

exports.search = (req,res,next) =>{
  res.status(200).json(Song.search(req.query.title));
}
