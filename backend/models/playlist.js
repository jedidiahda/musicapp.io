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
    console.log(playlists)
    return playlists.filter((p) => p.username == username);
  }

  add() {
    let user = playlists.filter((p) => p.username == this.username)[0];
    if (user) {
      let pl = user.list.find((p) => p == this.songId);
      if (!pl) {
        user.list.push(this.songId);
      }
      return this;
    }else{
      playlists.push({
        username: this.username,
        list:[this.songId]
      });
    }
    return this;
  }

  static remove(username, songId) {
    console.log("remove",playlists);
    let user = playlists.filter(p => p.username == username)[0];
    if (user) {
      // console.log(user);
      user.list = user.list.filter(p => p != songId);
    }
  }
}

module.exports = Paylist;
