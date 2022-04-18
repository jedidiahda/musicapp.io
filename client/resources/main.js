const baseUrl = 'http://localhost:3000';
let playlist = [];
let songs = [];
let index = 1;

window.onload = function () {
  console.log('window.onload');

  const usersession = sessionStorage.getItem('userSession');
  const login = document.getElementById('login');
  const btnLogout = document.getElementById('btnLogout');
  const landingPage = document.getElementById('landing-page');
  const songContent = document.getElementById('song-content');

  if (!usersession) {
    btnLogout.style.display = 'none';
    login.style.display = 'block';
    songContent.style.display = 'none';
    landingPage.style.display = 'block';
    showSongs();
    getPlaylist();
  } else {
    login.style.display = 'none';
    btnLogout.style.display = 'block';
    songContent.style.display = 'block';
    landingPage.style.display = 'none';
    document.getElementById('hhUsername').value = usersession.split(',')[0];
    showSongs();
    getPlaylist();
  }

  document.getElementById('btnLogin').onclick = onLogin;
  btnLogout.onclick = onLogout;
  document.getElementById('btnSearch').onclick= onSearch;
};

onLogin = async (e) => {
  // e.preventDefault();
  console.log('on login');

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
  songs = await fetch(`${baseUrl}/songs`).then((res) => res.json());

  renderSongElement();

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
}

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
    }),
  }).then((res) => res.json());

  console.log(newPlaylist);

  playlist.push({
    index: index++,
    id: newPlaylist.id,
    title: newPlaylist.title,
  });

  showPlaylistHeader();
}

getPlaylist = async () => {
  let username = document.getElementById('hhUsername').value;
  let list = await fetch(`${baseUrl}/playlists/${username}`).then((res) =>
    res.json()
  );

  list.forEach((a) => {
    playlist.push({
      index: index++,
      id: a.id,
      title: a.title,
    });
  });

  showPlaylistHeader();
};

showPlaylistHeader = ()=>{
  if (playlist.length > 0) {
    document.getElementById('playlist-header').innerHTML = 'Your Playlist';
    showPlaylistElement(playlist);
    
  } else {
    document.getElementById('playlist-header').innerHTML = 'No song in your playist';
    document.getElementById('playlistContent').innerHTML = '';
    index = 1;
  }
}

showPlaylistElement = (playlist) => {
  console.log('show playlist');
  document.getElementById('playlistContent').innerHTML = '';
  let tr = '';
  playlist.forEach((s) => {
    tr += '<tr>';
    tr += `<td>${s.index}</td>`;
    tr += `<td class="text-left">${s.title}</td>`;
    tr += `<td>
      <a class="fa-solid fa-circle-minus" onclick="removePlaylist(${s.id})"></a>
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
    }),
  })//.then((res) => res.json());
  console.log(res.status);

  if(res.status == 200){
    playlist = playlist.filter(p => p.id != id);
    showPlaylistElement(playlist);
  }

  showPlaylistHeader();

}

onLogout = (e) => {
  console.log('on logout');
  sessionStorage.removeItem('userSession');
  window.onload();
};

removeErrorElement = () => {
  let errorList = document.getElementsByClassName('error');
  for (let i = 0; i < errorList.length; i++) {
    errorList[i].remove();
  }
};

onSearch = (e) => {
  let title = document.getElementById('txtSearch').value;
  songs = songs.filter(s => s.title.toLowerCase().includes(title.toLowerCase()));
  renderSongElement();
}
