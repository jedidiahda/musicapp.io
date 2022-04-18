const Playlist = require('../models/playlist');
const Song = require('../models/song');

exports.getAll = async (req,res,next) => {
  const playlist = await Playlist.getAll(req.params.username);
  const songs = playlist[0] && await Song.getUserPLaylist(playlist[0].list) || [];
  res.status(200).json(songs);
}


exports.add = async (req,res,next) => {
  const {songId,username} = req.body;
  const newPlaylist = new Playlist(username,songId).add();
  const pl = await Song.getSong(newPlaylist.songId);
  res.status(200).json(pl);
}

exports.remove = (req,res,next) =>{
  Playlist.remove(req.body.username, req.body.songId);
  res.status(200).send('success');
}
