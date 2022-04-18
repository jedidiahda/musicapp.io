const express = require('express');
const playlistController = require('../controller/playlistController');

const route = express.Router();

route.get('/playlists/:username', playlistController.getAll);
route.post('/playlists', playlistController.add);
route.delete('/playlists', playlistController.remove);

module.exports = route;