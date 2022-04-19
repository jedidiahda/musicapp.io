const baseUrl = 'http://localhost:3000';
let playlist = [];
let songs = [];
let index = 1;
let currentPlay = 0;
let musicOption = {
  shuffle: false,
  repeatAll: false,
  repeatOne: false,
};
let audioIndex = 0;

window.onload = function () {
  playlist = [];
  songs = [];
  index = 1;
  currentPlay = 0;
  musicOption = {
    shuffle: false,
    repeatAll: true,
    repeatOne: false,
  };

  const usersession = sessionStorage.getItem('userSession');
  const login = document.getElementById('login');
  const btnLogout = document.getElementById('btnLogout');
  const landingPage = document.getElementById('landing-page');
  const songContent = document.getElementById('song-content');
  const search = document.getElementById('search');
  const footer = document.querySelector('.footer');

  //music
  const btnPause = document.querySelector('.fa-regular.fa-circle-pause');
  btnPause.style.display = 'none';
  document.querySelector('audio').currentTime = 0;
  document.querySelector('.fa-solid.fa-arrow-rotate-right').style.display ='none';

  clearHTMLContent();
  footer.style.visibility = 'hidden';
  if (!usersession) {
    btnLogout.style.display = 'none';
    login.style.display = 'block';
    songContent.style.display = 'none';
    landingPage.style.display = 'block';
    search.style.visibility = 'hidden';
  } else {
    login.style.display = 'none';
    btnLogout.style.display = 'block';
    songContent.style.display = 'block';
    landingPage.style.display = 'none';
    search.style.visibility = 'visible';
    document.getElementById('hhUsername').value = usersession.split(',')[0];
    showSongs();
    getPlaylist();
  }

  document.getElementById('btnLogin').onclick = onLogin;
  btnLogout.onclick = onLogout;
  document.getElementById('btnSearch').onclick = onSearch;
  document.querySelector('#footerAudio .fa-regular.fa-circle-play').onclick = playMusic;
  btnPause.onclick = pauseMusic;
  document.querySelector('.fa-regular.fa-circle-right').onclick = nextMusic;
  document.querySelector('.fa-regular.fa-circle-left').onclick = previousMusic;
  document.querySelector('.fa-solid.fa-shuffle').onclick = shuffleMusic;
  document.querySelector('.fa-solid.fa-repeat').onclick = repeatAllMusic;
  document.querySelector('.fa-solid.fa-arrow-rotate-right').onclick = repeatOneMusic;

  //fix audio duration inifite
  //https://www.thecodehubs.com/infinity-audio-video-duration-issue-fixed-using-javascript/
  //We can use the duration property to get the length of the current Audio/Video in seconds.
  //Unfortunately, with some Audio/Video we will see the duration as Infinity.
  //A chrome bug that causes the duration not to be available under certain circumstances.
  //The issue is in WebKit browsers, the metadata is loaded after the Audio/Video.
  //So the duration is not available when the JS runs.
  document
    .querySelector('audio')
    .addEventListener('loadedmetadata', function () {
      if (this.duration == Infinity) {
        this.currentTime = 1e101;
        this.ontimeupdate = function () {
          this.ontimeupdate = () => {
            return;
          };
          this.currentTime = 0;
          return;
        };
      }
    });
};

clearHTMLContent = () => {
  document.getElementById('playlistContent').innerHTML = '';
  document.getElementById('songContent').innerHTML = '';
};

onLogin = async (e) => {
  removeErrorElement();

  const txtUsername = document.getElementById('txtUsername');
  const txtPassword = document.getElementById('txtPassword');

  if (txtUsername.value == '') {
    const error = document.createElement('label');
    error.classList = 'error';
    error.innerHTML = 'Username is required';
    txtUsername.parentElement.appendChild(error);
  } else if (txtPassword.value == '') {
    const error = document.createElement('label');
    error.classList = 'error';
    error.innerHTML = 'Password is required';
    txtPassword.parentElement.appendChild(error);
  } else {
    const user = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: txtUsername.value,
        password: txtPassword.value,
      }),
    }).then((res) => res.json());

    if (user.session && user.session !== '') {
      document.getElementById('hhUsername').value = txtUsername.value;
      sessionStorage.setItem('userSession', user.session);
      txtUsername.value = '';
      txtPassword.value = '';
      window.onload();
    } else {
      const error = document.createElement('label');
      error.classList = 'error';
      error.innerHTML = user.errors.message;
      document.getElementById('login').appendChild(error);
    }
  }
};

showSongs = async () => {
  console.log('show songs');
  let userSession = sessionStorage.getItem('userSession'); // == null ? '' : sessionStorage.getItem('userSession');
  let res = await fetch(`${baseUrl}/songs?token=${userSession}`).then((res) =>
    res.json()
  );
  // console.log(res)
  if (res.errors) {
    songs = [];
    // window.onload();
  } else {
    songs = res;
    renderSongElement();
  }
};

renderSongElement = () => {
  let tr = '';
  songs.forEach((s) => {
    tr += '<tr>';
    tr += `<td>${s.id}</td>`;
    tr += `<td class="text-left">${s.title}</td>`;
    tr += `<td >${moment(s.releaseDate).format('yyyy-MM-DD')}</td>`;
    tr += `<td>
      <a class="fa-solid fa-circle-plus" id="btnAddPlaylist" onclick="addPlaylist(${s.id})"></a>
    </td>`;
    tr += '</tr>';
  });

  let table = `
    <table>
      <thead>
        <th>Id</th>
        <th>Title</th>
        <th>Release Date</th>
        <th>Actions</th>
      </thead>
      <tbody>
        ${tr}
      </tbody>
  `;

  document.getElementById('songContent').innerHTML = table;
};

async function addPlaylist(id) {
  if (playlist.findIndex((s) => s.id == id) > -1) {
    return;
  }

  let newPlaylist = await fetch(`${baseUrl}/playlists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      songId: id,
      username: document.getElementById('hhUsername').value,
      token: sessionStorage.getItem('userSession'),
    }),
  }).then((res) => res.json());

  // console.log(newPlaylist);

  playlist.push({
    index: index++,
    id: newPlaylist.id,
    title: newPlaylist.title,
    src: `http://localhost:3000/songs/mp3?id=${
      newPlaylist.id
    }&token=${sessionStorage.getItem('userSession')}`,
  });

  showPlaylistHeader();
}

getPlaylist = async () => {
  let username = document.getElementById('hhUsername').value;
  let userSession = sessionStorage.getItem('userSession');
  let res = await fetch(
    `${baseUrl}/playlists?username=${username}&token=${userSession}`
  ).then((res) => res.json());
  // console.log(res)
  if (res.errors) {
    playlist = [];
    // window.onload();
  } else {
    res.forEach((a) => {
      playlist.push({
        index: index++,
        id: a.id,
        title: a.title,
        // src: `./audio/${a.id}.mp3`,
        src: `http://localhost:3000/songs/mp3?id=${
          a.id
        }&token=${sessionStorage.getItem('userSession')}`,
      });
    });

    showPlaylistHeader();
  }
};

showPlaylistHeader = () => {
  if (playlist.length > 0) {
    document.getElementById('playlist-header').innerHTML = 'Your Playlist';
    showPlaylistElement(playlist);
  } else {
    document.getElementById('playlist-header').innerHTML =
      'No song in your playist';
    document.getElementById('playlistContent').innerHTML = '';
    index = 1;
  }
};

showPlaylistElement = (playlist) => {
  console.log('show playlist');
  document.getElementById('playlistContent').innerHTML = '';
  let tr = '';
  playlist.forEach((s, index) => {
    tr += '<tr>';
    tr += `<td>${s.index}</td>`;
    tr += `<td class="text-left">${s.title}</td>`;
    tr += `<td>
      <a class="fa-solid fa-circle-minus" onclick="removePlaylist(${s.id})"></a>
      <a class="fa-regular fa-circle-play" onclick="playSelectedMusic(${index})"></a>
    </td>`;
    tr += '</tr>';
  });

  let table = `
    <table>
      <thead>
        <th>Index</th>
        <th>Title</th>
        <th>Actions</th>
      </thead>
      <tbody>
        ${tr}
      </tbody>
  `;

  document.getElementById('playlistContent').innerHTML = table;
};

removePlaylist = async (id) => {
  let res = await fetch(`${baseUrl}/playlists`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      songId: id,
      username: document.getElementById('hhUsername').value,
      token: sessionStorage.getItem('userSession'),
    }),
  }); //.then((res) => res.json());
  console.log(res.status);

  if (res.status == 200) {
    playlist = playlist.filter((p) => p.id != id);
    showPlaylistElement(playlist);
    // getPlaylist();
  }

  showPlaylistHeader();
};

onLogout = (e) => {
  console.log('on logout');
  sessionStorage.removeItem('userSession');
  document.querySelector('audio').pause();
  window.onload();
};

removeErrorElement = () => {
  let errorList = document.getElementsByClassName('error');
  for (let i = 0; i < errorList.length; i++) {
    errorList[i].remove();
  }
};

onSearch = async (e) => {
  let title = document.getElementById('txtSearch').value;
  let userSession = sessionStorage.getItem('userSession');
  let res = await fetch(
    `${baseUrl}/songs/search?title=${title}&token=${userSession}`
  ).then((res) => res.json());
  songs = res;
  if (title != '') {
    document.getElementById('songHeader').innerHTML = `Results of '${title}'`;
  } else {
    document.getElementById('songHeader').innerHTML = 'Songs you may interest';
  }
  renderSongElement();
};


function playMusic() {
  let player = document.querySelector('audio');
  let startTime = document.getElementById('startTime');
  let endTime = document.getElementById('endTime');

  document.querySelector('.footer').style.visibility = 'visible';

  //exit interval if duration is NaN
  if(isNaN(player.duration)){
    return;
  } 

  if (currentPlay < playlist.length) {
    if (player.currentTime > 0) {
      player.play();
    } else {
      player.src = playlist[currentPlay].src;
      player.play();
    }
    
    document.getElementById('songTitle').innerHTML = playlist[currentPlay].title;
    document.querySelector(
      '#footerAudio .fa-regular.fa-circle-play'
    ).style.display = 'none';
    document.querySelector('.fa-regular.fa-circle-pause').style.display = 'block';

    if (audioIndex == 0) {
      audioIndex = 1;
      var elem = document.getElementById('myBar');
      var width = 1;
      var id = setInterval(frame, 10);

      function frame() {
        if (width >= 100) {
          clearInterval(id);
          audioIndex = 0;
          console.log('music end');

          if (musicOption.repeatOne == true) {
            playMusic();
          } else if (
            musicOption.repeatAll == true &&
            currentPlay == playlist.length - 1
          ) {
            currentPlay = 0;
            playMusic();
          }
        } else {
          const current = player.currentTime;
          const percent = (current / player.duration) * 100;
          // width++;

          let s = parseInt(player.currentTime % 60);
          let m = parseInt((player.currentTime / 60) % 60);
          let h = parseInt((player.currentTime / 60 / 60) % 60);

          startTime.innerHTML = h + ':' + m + ':' + s;

          let es = Math.floor(player.duration % 60);
          let em = parseInt((player.duration / 60) % 60);
          let eh = parseInt((player.duration / 60 / 60) % 60);

          endTime.innerHTML = eh + ':' + em + ':' + es;
          width = percent;
          elem.style.width = width + '%';
        }
      }
    }
  }
}

playSelectedMusic = (selectedIndex) => {
  currentPlay = selectedIndex;
  document.querySelector('audio').currentTime = 0;
  playMusic();
}

function pauseMusic() {
  let player = document.querySelector('audio');
  player.pause();
  document.querySelector('.fa-regular.fa-circle-pause').style.display = 'none';
  document.querySelector(
    '#footerAudio .fa-regular.fa-circle-play'
  ).style.display = 'block';
}

nextMusic = () => {
  console.log('nextmusic');
  if (currentPlay >= playlist.length - 1) currentPlay = -1;

  currentPlay = currentPlay + 1;
  document.querySelector('audio').currentTime = 0;
  playMusic();
};

previousMusic = () => {
  console.log('previousmusic');
  //2,1,0
  currentPlay = currentPlay - 1;
  if (currentPlay == -1) currentPlay = playlist.length - 1;
  document.querySelector('audio').currentTime = 0;
  playMusic();
};

shuffleMusic = async () => {
  musicOption.shuffle = !musicOption.shuffle;
  console.log(musicOption.shuffle);
  if (musicOption.shuffle == true) {
    await shufflePlaylist();
    showPlaylistHeader();
    musicOption.shuffle = false;
  }
};

repeatAllMusic = () => {
  musicOption.repeatAll = !musicOption.repeatAll;

  if (musicOption.repeatAll == false) {
    document.querySelector('.fa-solid.fa-repeat').style.display = 'none';
    document.querySelector('.fa-solid.fa-arrow-rotate-right').style.display =
      'inline-block';
    musicOption.repeatOne = true;
  }
};

repeatOneMusic = () => {
  musicOption.repeatOne = !musicOption.repeatOne;

  if (musicOption.repeatOne == false) {
    document.querySelector('.fa-solid.fa-repeat').style.display =
      'inline-block';
    document.querySelector('.fa-solid.fa-arrow-rotate-right').style.display =
      'none';
    musicOption.repeatAll = true;
  }
};

shufflePlaylist = () => {
  for (var i = playlist.length - 1; i > 0; i--) {
    // Generate random number
    var j = Math.floor(Math.random() * (i + 1));

    var temp = playlist[i];
    playlist[i] = playlist[j];
    playlist[j] = temp;
  }
};
