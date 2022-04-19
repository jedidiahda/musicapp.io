const Playlist = require('../models/playlist');
const Song = require('../models/song');

exports.getAll = async (req, res, next) => {
  const playlist = await Playlist.getAll(req.query.username);
  // console.log(req.query.username);
  // console.log("getallplaylist",playlist[0]);
  if (playlist[0]) {
    const songs = await Song.getUserPLaylist(playlist[0].list);
    console.log("getall song",songs);
    res.status(200).json(songs);
  }else{
    res.status(200).json([]);
  }
};

exports.add = async (req, res, next) => {
  const { songId, username } = req.body;
  const newPlaylist = new Playlist(username, songId).add();
  const pl = await Song.getSong(newPlaylist.songId);
  res.status(200).json(pl);
};

exports.remove = (req, res, next) => {
  // console.log('remove', req.body);
  Playlist.remove(req.body.username, req.body.songId);
  res.status(200).send('success');
};
