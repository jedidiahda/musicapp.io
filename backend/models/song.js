let songs = [
  {
    id: 1,
    title: 'Save your tears',
    artist: 'The Weeknd',
    releaseDate: new Date(2021, 3, 21), //APR 22 2021
  },
  {
    id: 2,
    title: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar, Giveon',
    releaseDate: new Date(2021, 2, 18), //March 19 2021
  },
  {
    id: 3,
    title: 'Out of Time',
    artist: 'The Weeknd',
    releaseDate: new Date(2021, 2, 18), //March 19 2021
  },
  {
    id: 4,
    title: 'Close',
    artist: 'Nick Jonas ft. Tove Lo',
    releaseDate: new Date(2021, 2, 18), //March 19 2021
  },
  {
    id: 5,
    title: 'Bad Things',
    artist: 'Camila Cabello',
    releaseDate: new Date(2021, 2, 18), //March 19 2021
  },
  {
    id: 6,
    title: 'Kill Em With Kindness',
    artist: 'Selena Gomez',
    releaseDate: new Date(2021, 2, 18), //March 19 2021
  },
];

class Song {
  static getAll() {
    return songs;
  }

  static getUserPLaylist(playlist){
    // console.log('playlist song', playlist)
    let list = [];
    for(let i= 0; i < songs.length;i++){
      for(let j=0;j<playlist.length;j++){
        if(songs[i].id == playlist[j]){
          list.push(songs[i]);
        }
      }
    }
    // return songs.filter(function (s) { return this == s.id;}, playlist);
    return list;
  }

  static getSong(playlistId){
    return songs.find(s => s.id == playlistId);
  }

  static search(title){
    return songs.filter(s => s.title.toLowerCase().includes(title.toLowerCase()));
  }
}

module.exports = Song;
