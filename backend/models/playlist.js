let playlists = [
  {
    username: 'user1',
    list: [2],
  },
];

class Paylist {
  constructor(username, songId) {
    this.songId = songId;
    this.username = username;
  }

  static getAll(username) {
    return playlists.filter((p) => p.username == username);
  }

  add() {
    let list = playlists.find((p) => p.username == this.username);
    if (list) {
      let pl = list.list.find((p) => p == this.songId);
      if (!pl) {
        list.list.push(this.songId);
      }
      return this;
    }
    return null;
  }

  static remove(username, songId) {
    let pl = playlists.find((p) => p.username == username);
    if (pl) {
      pl.list = pl.list.filter((p) => p.songId != songId);
    }
  }
}

module.exports = Paylist;
