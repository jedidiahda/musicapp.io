const Song = require('../models/song');
const fs = require('fs');
const path = require('path');

exports.getAll = (req,res,next) => {
  res.status(200).json(Song.getAll());
}

exports.search = (req,res,next) =>{
  res.status(200).json(Song.search(req.query.title));
}

exports.getMp3 = (req,res,next) => {
  var readStream = fs.createReadStream(path.join(__dirname,'..','audio',`${req.query.id}.mp3`));
  readStream.on('data', (data) => {
      res.write(data);
  });
  readStream.on('end', (data) => {
      res.status(200).send();
  });
  readStream.on('error',(err) => {
    res.status(404).send();
  })
}
