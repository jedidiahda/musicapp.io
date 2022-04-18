const Song = require('../models/song');

exports.getAll = (req,res,next) => {
  console.log(req.session);
  res.status(200).json(Song.getAll());
}
