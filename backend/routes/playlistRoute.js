const express = require('express');
const playlistController = require('../controller/playlistController');
const currentUser = require('../middleware/current-user');

const route = express.Router();

route.get('/playlists',currentUser, playlistController.getAll);
route.post('/playlists',currentUser, playlistController.add);
route.delete('/playlists',currentUser, playlistController.remove);

module.exports = route;