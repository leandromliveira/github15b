const CLIENT_ID = 'cf8354bf40da4ea0803c97775457e022';
const CLIENT_SECRET = '6c3e8b7786994bfaac8aef56ac64a4fc';
const BASE_URL = 'https://api.spotify.com/v1';

let token;

// HELPERS 
function getElementOrClosest(target, className){
  if(target.classList.contains(className)){
    return target;
  } 

  return target.closest(`.${className}`)
}

function createPlayer(){
  const playerContainer = document.querySelector('.player-container');

  const audio = document.createElement('audio');
  audio.id = 'player';
  audio.controls = true;
  audio.autoplay = true;

  const source = document.createElement('source');

  audio.appendChild(source);
  playerContainer.appendChild(audio);

  return audio;
}

// API SPOTIFY

function getHeaders(){
  const headers = new Headers({
    'Authorization': `Bearer ${token}`,
  })

  return headers;
}

async function getToken(){
  const idAndSecret = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const authorizationHeader = `Basic ${btoa(idAndSecret)}`

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded')
  headers.append('Authorization', authorizationHeader)

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers,
  })

  const data = await response.json();
  
  token = data.access_token;

  return token;
}

async function getGenres(){
  const headers = getHeaders();

  const response = await fetch(`${BASE_URL}/browse/categories?country=BR&locale=pt-BR`, {
    headers
  });

  const data = await response.json();

  renderGenres(data.categories.items)
}

async function getGenrePlaylists(id){
  const headers = getHeaders();

  const response = await fetch(`${BASE_URL}/browse/categories/${id}/playlists`, {
    headers
  });

  const data = await response.json();

  renderPlaylists(data.playlists.items)
}

async function getPlaylistTracks(id) {
  const headers = getHeaders();

  const response = await fetch(`${BASE_URL}/playlists/${id}/tracks`, {
    headers
  });

  const data = await response.json();

  renderTracks(data.items)
}

// RENDERS

function clearCards(selector){
  const cards = document.querySelector(selector);

  cards.innerHTML = '';
}

function renderGenres(genres){
  const genresCards = document.querySelector('.genres-cards');

  genres.forEach(genre => {
    const section = document.createElement('section');
    section.className = 'genre';
    section.id = genre.id;

    const image = document.createElement('img');
    image.src = genre.icons[0].url;

    const paragraph = document.createElement('p');
    paragraph.innerText = genre.name;

    section.appendChild(image);
    section.appendChild(paragraph);

    genresCards.appendChild(section);

    section.addEventListener('click', handleGenreClick)
  })
}

function renderPlaylists(playlists){
  clearCards('.playlists-cards');

  const playlistsCards = document.querySelector('.playlists-cards');

  playlists.forEach(playlist => {
    const section = document.createElement('section');
    section.className = 'text-card playlist';
    section.id = playlist.id;

    const paragraph = document.createElement('p');
    paragraph.innerText = playlist.name;

    section.appendChild(paragraph);
    playlistsCards.appendChild(section)

    section.addEventListener('click', handlePlaylistClick);
  })
}

function renderTracks(tracks){
  clearCards('.tracks-cards');

  const tracksCards = document.querySelector('.tracks-cards');

  tracks
    .filter(({ track }) => track && track.preview_url)
    .forEach(({ track }) => {
      const section = document.createElement('section');
      section.className = 'text-card track';
      section.id = track.preview_url;

      const paragraph = document.createElement('p');
      paragraph.innerText = track.name ;

      section.appendChild(paragraph);
      tracksCards.appendChild(section);

      section.addEventListener('click', handleTrackClick)
    })
}

// EVENT HANDLERS
function handleGenreClick({ target }){
  const section = getElementOrClosest(target, 'genre');

  const previousSelect = document.querySelector('.genres-cards .item-selected')
  
  if(previousSelect){
    previousSelect.classList.remove('item-selected')
  }

  section.classList.add('item-selected')

  getGenrePlaylists(section.id);
}

function handlePlaylistClick({ target }){
  const section = getElementOrClosest(target, 'playlist');

  const previousSelect = document.querySelector('.playlists-cards .item-selected')
  
  if(previousSelect){
    previousSelect.classList.remove('item-selected')
  }

  section.classList.add('item-selected')

  getPlaylistTracks(section.id);
}

function handleTrackClick({ target }){
  const section = getElementOrClosest(target, 'track');

  const previousSelect = document.querySelector('.tracks-cards .item-selected')
  
  if(previousSelect){
    previousSelect.classList.remove('item-selected')
  }

  section.classList.add('item-selected');

  const player = document.querySelector('#player') ? document.querySelector('#player') : createPlayer();

  const source = player.querySelector('source');
  source.src = section.id;
  
  player.load();

  const musicPlaying = document.querySelector('.music-playing');

  musicPlaying.innerText = section.querySelector('p').innerText;
}

//ONLOAD

window.onload = async () => {
  try {
    await getToken();

    getGenres();
  } catch (error) {
    console.log(error)
  }
}