let songs = [
  {
    id: 1,
    title: 'Save your tears',
    artist: 'The Weeknd',
    releaseDate: new Date(2021, 3, 21), //APR 22 2021
    timeSpan: '04:09',
  },
  {
    id: 2,
    title: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar, Giveon',
    releaseDate: new Date(2021, 2, 18), //March 19 2021
    timeSpan: '03:18',
  },
  {
    id: 3,
    title: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar, Giveon',
    releaseDate: new Date(2021, 2, 18), //March 19 2021
    timeSpan: '03:18',
  },
  {
    id: 4,
    title: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar, Giveon',
    releaseDate: new Date(2021, 2, 18), //March 19 2021
    timeSpan: '03:18',
  },
  {
    id: 5,
    title: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar, Giveon',
    releaseDate: new Date(2021, 2, 18), //March 19 2021
    timeSpan: '03:18',
  },
  {
    id: 6,
    title: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar, Giveon',
    releaseDate: new Date(2021, 2, 18), //March 19 2021
    timeSpan: '03:18',
  },
];

class Song {
  static getAll() {
    return songs;
  }

  static getUserPLaylist(playlist){
    if (playlist && playlist.length > 0) {
      return songs.filter(function (s) { return this == s.id;}, playlist);
    }
    return [];
  }

  static getSong(playlistId){
    return songs.find(s => s.id == playlistId);
  }
}

module.exports = Song;
