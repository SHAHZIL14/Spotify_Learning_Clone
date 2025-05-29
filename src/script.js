// Optimized and cleaned version of your script.js for static hosting like GitHub Pages
// Key fixes:
// - Removed fetch from local Songs directory (not supported on static hosts)
// - Hardcoded song list
// - Refactored recent list logic
// - Removed unused variables
// - Simplified DOM access and loop logic
async function main() {
  const data = await (await fetch("/resources/Data_Modules/DATA.json")).json();
  const artistData = (await (await fetch("/resources/Data_Modules/artistData.json")).json())["artists"];
  let currentSong = new Audio();
  let currentSongIndex = null;
  let currentSongLi = null;
  let currentSrc = null;
  let loop = 0;
  let songs = (Array.from(data)).map((eachSongObject) => eachSongObject.songName);
  const artistNames = (Array.from(data)).map((eachSongObject) => eachSongObject.artist);
  const playButton = document.querySelector(".Play");
  const recentList = [];

  function playSong(track) {
    currentSong.src = `/resources/Songs/${track}`;
    currentSong.play();
  }


  function renderSongList() {
    const songListEl = document.querySelector(".songlist ul");
    songListEl.innerHTML = "";

    songs.forEach((song, index) => {
      const songName = song.replace(".mp3", "");

      const li = document.createElement("li");
      li.id = index;
      li.className = "song";

      li.innerHTML = `
      <div class="info">
        <div class="song-name">${songName}</div>
      </div>
      <div class="playbutton">
        <img class="svgs-new" src="/resources/SVGS/play-circle-svgrepo-com.svg" alt="">
      </div>
    `;

      li.addEventListener("click", () => handleSongClick(index));

      songListEl.appendChild(li);
    });

    top_Result_Rendering();
  }

  function alert(textContent) {
    Toastify({
      text: textContent,
      duration: 2500,
      gravity: "top",
      position: "center",
      backgroundColor: "#121212"
    }).showToast();
  }


  function top_Result_Rendering() {
    try {
      const section = document.getElementById('song-card-listing-new');
      let index = 0;
      for (const song of data) {
        const div = document.createElement('div');
        div.setAttribute('class', 'song-card');
        div.innerHTML = `
            <img src="./resources/Posters/${song.poster}" alt="Song Cover">
            <div class="song-details">
                <h1 class="gaane">${song.songName}</h1>
                <div class="artist-name">
                    <span>Song .${song.artist} </span>
                    <span class="Play-now" id="${index}" style="float: right;">Play Now</span>
                </div>
            </div>`
        section.appendChild(div);
        index++;
      }
    } catch (error) {
      console.log(error);
    }

  }

  async function fetchAudioDuration(src) {
    return await new Promise((resolve, reject) => {
      const audio = new Audio(src);

      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration)
      });

      audio.addEventListener('error', (e) => {
        reject(new Error)
      });
    });
  }

  async function createCard(song, index) {
    try {
      const SRC = `/resources/Songs/${song.songName}`
      const duration = await fetchAudioDuration(SRC);
      const ul = document.getElementById('card-listing-ul');
      let newLi = document.createElement('li');
      newLi.setAttribute('class', 'card-list-li');
      newLi.setAttribute("id", index);
      newLi.innerHTML = `
        <div class="li-flex">
        <img src="./resources/Posters/${song.poster}" alt=""
            class="card-list-img">
        <div class="card-list-details">
            <div class="song-name">${song.songName.replace(".mp3", "")}</div>
            <div class="artist-name-card-list">${song.artist}</div>
        </div>
        </div>
        <div class="extras">
        <div class="duration">${formatTime(duration)}</div>
        </div>`
      newLi.addEventListener('click', () => {
        let clickedSongName = newLi.children[0].children[1].children[0].innerText.toString().concat(".mp3");
        data.forEach((eachSongObject) => {
          if (clickedSongName == eachSongObject.songName) {
            return handleSongClick(eachSongObject.id);
          }
        })
      })
      ul.appendChild(newLi);
      if (newLi.children[0].children[1].children[0].innerText == currentSong.src.toString().split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "") &&
        document.getElementsByClassName('selected').length == 1
      ) {
        newLi.classList.add("selected-list");
      }
      else newLi.classList.remove("selected-list");
    } catch (error) {
      console.log(error);
    }

  }

  async function createArtistCard(artist) {
    const parentDiv = document.getElementsByClassName('artist-card-section')[0].children[1];
    const div = document.createElement('div');
    div.setAttribute("class", "artist-card");
    div.innerHTML = `
        <div class="artist-image"><img src="${artist.poster}" alt=""></div>
        <div class="text">
            <div class="artist-name">${artist.name}</div>
            <div class="artist-text">${artist.artist_work}</div>
        </div>
        `
    div.addEventListener('click', function (e) {
      let localArtistData = null;
      let artistObject = null;
      fetch("/resources/Data_Modules/artistData.json")
        .then((response) => response.json())
        .then((response) => {
          localArtistData = response["artists"];
          if (localArtistData) {
            localArtistData.forEach((eachArtistObject) => {
              let clickedSRC = e.target.src.slice(21).includes("%20") ? e.target.src.slice(21).replaceAll("%20", " ") : e.target.src.slice(21);
              if (clickedSRC == eachArtistObject.poster) artistObject = eachArtistObject
            });
            createArtistDescriptionCard(artistObject);
          }
        })
    })
    parentDiv.appendChild(div);
  }

  function topResultCreateCard(song, index) {
    const grandParent = document.getElementById('grandParent');
    grandParent.innerHTML = '';
    const parentDiv = document.createElement('div');
    parentDiv.setAttribute('class', 'song-card');
    parentDiv.innerHTML = `
        <img id ="topResultImage"src="/resources/Posters/${song.poster}" alt="Song Cover">
        <div class="song-details">
            <h1 class="gaane">${song.songName.replace(".mp3", "")}</h1>
            <div class="artist-name">
                <span>${song.artist} </span>
                <span id="playBtn" class="Play-now" id="${index}" style="float: right;">Play Now</span>
            </div>

        </div>
        `
    grandParent.appendChild(parentDiv);
    document.getElementById('playBtn').addEventListener('click', (e) => {
      let clickedSongName = e.target.parentElement.parentElement.children[0].innerText.concat(".mp3");
      data.forEach((eachSongObject) => {
        if (clickedSongName == eachSongObject.songName) {
          return handleSongClick(eachSongObject.id);
        }
      })
      document.getElementsByClassName('song-card')[0].classList.add("selected-card");
    });

    let songCardText = parentDiv.children[1].children[0].innerText;
    let currentSongName = currentSong.src ? (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "") : null;
    if (songCardText == currentSongName && document.getElementsByClassName('selected').length == 1) {
      document.getElementsByClassName('song-card')[0].classList.add('selected-card');
    }

  }

  function createArtistDescriptionCard(artist) {
    if (!artist || !artist.topSongs || !artist.genres) {
      console.error("Invalid artist object:", artist);
      return;
    }
    const body = document.querySelector('body');
    let topSongs = " ";
    let genre = " ";
    (artist.topSongs).forEach((eachSong) => { topSongs += eachSong + " , " });
    (artist.genres).forEach((eachGenre) => { genre += eachGenre + " , " });
    const artistDescriptionCard = document.createElement('div');
    artistDescriptionCard.setAttribute('class', 'artist-float-card');
    artistDescriptionCard.innerHTML = `
    <span id="close-card" class="close-btn" >×</span>
  <img src="${artist.poster}" alt="Arijit Singh">
  <div class="artist-details">
    <h2>${capitalizeWords(artist.name)}</h2>
    <p>${artist.para}</p>
    <ul>
      <li><strong>Top Songs:</strong>${topSongs.slice(0, topSongs.length - 2)}</li>
      <li><strong>Spotify Listeners:</strong> ${artist.monthlyListeners} monthly</li>
      <li><strong>Genres:</strong> ${genre.slice(0, genre.length - 2)}</li>
      <li><strong>Awards:</strong>${" " + artist.awards}</li>
      <li><strong>Years Active:</strong> ${artist.activeYears}</li>
    </ul>
  </div>
    `
    document.getElementsByClassName('container')[0].style.filter = "brightness(10%)";
    body.appendChild(artistDescriptionCard);
    document.getElementById('close-card').addEventListener('click', () => {
      document.getElementsByClassName('artist-float-card')[0].remove();
      document.getElementsByClassName('container')[0].style.filter = "brightness(100%)";
    });
  }

  async function cardListRendering(filteredArray) {
    try {
      const ul = document.getElementById('card-listing-ul');
      ul.innerText = "";
      let index = 0;
      for (const songObject of filteredArray) {
        await createCard(songObject, index);
        index++;
      }

    } catch (error) {

    }

  }

  async function defaultCardRendering() {
    const data = await (await fetch("/resources/Data_Modules/DefaultCardData.json")).json();
    const browseSection = document.getElementsByClassName('browse-section')[0];
    for (let i = 0; i < 100; i++) {
      let currentDataCard = data[i % data.length]
      let newDiv = document.createElement('div');
      newDiv.setAttribute('class', 'browse-all-cards');
      newDiv.innerHTML = `
            <p class="genre">${currentDataCard.title}</p>
            <img class="rotate-img" src="${currentDataCard.image}" alt="">
            `
      browseSection.appendChild(newDiv);
    }
    coloringTheCards();

  }

  async function artistCardRendering(filteredArtist) {
    try {
      console.log(filteredArtist);
      const artistSection = document.getElementsByClassName('artist-card-section')[0];
      if (filteredArtist.length != 0) {
        artistSection.innerHTML = `
                <h2>Artists</h2>
                <div class="artist-card-section-flex"></div>
                `
        for (const artistObject of filteredArtist) {
          await createArtistCard(artistObject)
        }
      }
      else artistSection.innerHTML = "";

    } catch (error) {
      console.log(error);
    }
  }

  async function renderDailyMix() {
    const dailyMixCards = Array.from(document.getElementsByClassName('made-box-card'));

    // Guard against missing artistData
    if (!artistData || artistData.length === 0) return;

    const startIndex = Math.floor(Math.random() * artistData.length);

    for (let i = 0; i < dailyMixCards.length; i++) {
      const currentCard = dailyMixCards[i];
      const artist = artistData[(startIndex + i) % artistData.length];

      if (artist && artist.poster) {
        const poster = artist.poster.trim();
        currentCard.style.backgroundImage = `url('${poster}')`;
        currentCard.style.backgroundRepeat = "no-repeat";
        currentCard.style.backgroundSize = "cover";
      } else {
        console.warn("Missing artist or poster at index", i);
      }
    }
  }

  function searching() {
    let currentInput = document.getElementById('searchbox').value.toLowerCase();
    let defaultBox = document.getElementById('default');
    let artistSection = document.getElementsByClassName('artist-card-section')[0];
    let searchSection = document.getElementById('searchup');
    let matchingSongList = [];
    let matchingArtistList = [];
    if (currentInput && currentInput.length > 0) {
      matchingSongList = data.filter((eachSongObject) => { if (eachSongObject.songName.toLowerCase().trim().includes(currentInput.toLowerCase().trim())) return eachSongObject });

      matchingArtistList = artistData.filter((eachArtistObject) => {
        if (eachArtistObject.name.toLowerCase().trim().includes(currentInput.toLowerCase().trim())) return eachArtistObject
      });

      if (matchingSongList.length != 0) {
        defaultBox.style.display = "none";
        document.getElementsByClassName("main-content")[0].style.display = "flex";
        document.getElementsByClassName('unavailable')[0].style.display = 'none';
        Array.from(document.getElementsByClassName('Headings')).forEach((element) => {
          element.style.display = "flex";
        })
        searchSection.style.display = "flex";
        cardListRendering(matchingSongList);
        topResultCreateCard(matchingSongList[0], 0);
      }
      else if (matchingArtistList.length != 0 && matchingSongList.length == 0) {
        document.getElementsByClassName('main-content')[0].style.display = "none";
      }
      else {
        document.getElementById('searchup').style.display = 'none';
        document.getElementsByClassName('unavailable')[0].style.display = 'block';
        Array.from(document.getElementsByClassName('Headings')).forEach((element) => {
          element.style.display = "none";
        })
      }

      artistCardRendering(matchingArtistList);
    }
    else {
      defaultBox.style.display = "block";
      searchSection.style.display = "none";
      artistSection.innerHTML = ""
    }


  }

  function handleSongClick(index) {
    if (currentSongLi) {
      currentSongLi.classList.remove("selected-list");
    }
    if (currentSongIndex !== null && !loop) {
      const prevLi = document.getElementById(currentSongIndex);
      prevLi.classList.remove("selected");
      prevLi.querySelector(".playbutton img").src = "/resources/SVGS/play-circle-svgrepo-com.svg";
    }

    currentSongIndex = index;
    currentSongLi = document.getElementById(index);
    currentSongLi.classList.add("selected-list");
    currentSongLi.classList.add("selected");
    currentSongLi.querySelector(".playbutton img").src = "/resources/SVGS/pause-stroke-rounded.svg";
    currentSongLi.querySelector(".playbutton img").style.filter = "invert(1)";

    currentSrc = songs[index];
    playSong(currentSrc);

    updateSongAbout(index);
    updateRecentList(index);
    if (document.getElementsByClassName('song-card').length != 0) {
      let songCardText = document.getElementsByClassName('song-card')[0].children[1].children[0].innerText;
      let currentSongName = (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "");
      console.table([songCardText, currentSongName]);
      if (songCardText != currentSongName) {
        document.getElementsByClassName('song-card')[0].classList.remove('selected-card');
      }
      else {
        document.getElementsByClassName('song-card')[0].classList.add('selected-card');
      }
    }
    if (document.getElementsByClassName('card-list-li').length != 0) {
      let currentSongName = (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "");
      Array.from(document.getElementsByClassName('card-list-li')).forEach((currentSongList) => {
        if (currentSongList.children[0].children[1].children[0].innerText == currentSongName) {
          currentSongList.classList.add("selected-list");
        }
        else {
          currentSongList.classList.remove("selected-list");
        }
      })
    }
    playButton.querySelector("img").src = "/resources/SVGS/pause-stroke-rounded.svg";
  }

  function updateSongAbout(index) {
    document.getElementById("song-about").innerHTML = `
    <div id="song-name">
      <div class="poster">
        <img class="svgs1" src="/resources/Posters/${data[index].poster}" alt="">
      </div>
      <div class="content">
        <div class="song-name-poster">${songs[index].replace(".mp3", "")}</div>
        <div class="artist-name-poster">${artistNames[index]}</div>
      </div>
    </div>
  `;
  }

  function updateRecentList(index) {
    if (!recentList.includes(index)) {
      if (recentList.length >= 6) recentList.shift();
      recentList.push(index);
      renderRecentCards();
    }
  }

  function renderRecentCards() {
    const container = document.querySelector(".recent-container");
    container.innerHTML = "";
    container.style.justifyContent = "flex-start";

    recentList.forEach(index => {
      const card = document.createElement("div");
      card.className = "song-card-div";
      card.innerHTML = `
            <div class="song-carding">
              <div class="poster-song">
                <img src="/resources/Posters/${(data[index].poster)}" alt="">
              </div>
              <div class="about-song-card">${songs[index].replace(".mp3", "")}</div>
            </div>
          `;
      container.prepend(card);
    });
  }

  const colorCard = (array) => {
    array.forEach((element) => {
      let random_red = Math.random() * 100;
      let random_green = Math.random() * 100;
      let random_blue = Math.random() * 100;
      element.style.background = `rgb(${random_red}, ${random_green}, ${random_blue})`;
    })
  }

  const coloringTheCards = () => {
    let card_array = Array.from(document.getElementsByClassName('browse-all-cards'));
    colorCard(card_array);
  }

  function setupPlayButton() {
    playButton.addEventListener("click", () => {
      if (!currentSong.src) return alert("Please Load any song from the playlist before running the track.");
      const isPaused = currentSong.paused;
      const icon = playButton.querySelector("img");
      const currentLi = document.getElementById(currentSongIndex);
      if (isPaused) {
        currentSong.play();
        currentSongLi.classList.add("selected");
        if (document.getElementsByClassName('song-card').length != 0) {
          document.getElementsByClassName('song-card')[0].classList.add("selected-card");
        }
        icon.src = "/resources/SVGS/pause-stroke-rounded.svg";
        currentLi.querySelector(".playbutton img").src = "/resources/SVGS/pause-stroke-rounded.svg";
        currentLi.querySelector(".playbutton img").style.filter = "invert(1)";
        if (document.getElementsByClassName('card-list-li').length != 0) {
          let currentSongName = (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "");
          Array.from(document.getElementsByClassName('card-list-li')).forEach((currentSongList) => {
            if (currentSongList.children[0].children[1].children[0].innerText == currentSongName) {
              currentSongList.classList.add("selected-list");
            }
            else {
              currentSongList.classList.remove("selected-list");
            }
          })
        }
      } else {
        currentSong.pause();
        currentSongLi.classList.remove("selected");
        if (document.getElementsByClassName('song-card').length != 0) {
          document.getElementsByClassName('song-card')[0].classList.remove("selected-card");
        }
        icon.src = "/resources/SVGS/play-stroke-rounded.svg";
        currentLi.querySelector(".playbutton").firstElementChild.src = "/resources/SVGS/play-circle-svgrepo-com.svg";
        if (document.getElementsByClassName('card-list-li').length != 0) {
          Array.from(document.getElementsByClassName('card-list-li')).forEach((currentSongList) => {
            currentSongList.classList.remove("selected-list");
          })
        }
      }
    });
  }

  function setupNextButton() {
    let currentSongName = currentSong.src.toString().split('/')[5].replaceAll("%20", " ");
    let currentSongObject = data.filter((eachSongObject) => { if (eachSongObject.songName == currentSongName) return eachSongObject });
    let index = currentSongObject[0].id == (data.length - 1) ? 0 : currentSongObject[0].id + 1;
    handleSongClick(index);
  }

  function setupPrevButton() {
    let currentSongName = currentSong.src.toString().split('/')[5].replaceAll("%20", " ");
    let currentSongObject = data.filter((eachSongObject) => { if (eachSongObject.songName == currentSongName) return eachSongObject });
    let index = currentSongObject[0].id == 0 ? (data.length - 1) : currentSongObject[0].id - 1;
    handleSongClick(index);
  }

  function setupLoopToggle() {
    document.querySelector(".loop1").addEventListener("click", () => {
      loop = !loop;
      currentSong.loop = loop;
      document.querySelector(".loop1").style.filter = loop ? "contrast(0.0001)" : "invert(1)";
    });
  }

  function setupSeekbar() {
    const seekbar = document.querySelector(".seekbar");
    const rocker = document.getElementById("seek-rocker");

    currentSong.addEventListener("timeupdate", () => {
      if (!currentSong.duration) return;
      const percentage = currentSong.currentTime / currentSong.duration;
      rocker.style.width = `${percentage * 100}%`;
      document.getElementById("current-time").textContent = formatTime(currentSong.currentTime);
      document.getElementById("current-duration").textContent = formatTime(currentSong.duration);
      if (percentage == 1 && !loop) {
        const prevLi = document.getElementById(currentSongIndex);
        prevLi.classList.remove("selected");
        prevLi.querySelector(".playbutton img").src = "/resources/SVGS/play-circle-svgrepo-com.svg";
        document.querySelector('.Play').children[0].src = '/resources/SVGS/play-stroke-rounded.svg';
        rocker.style.width = '0%';
        document.getElementsByClassName("selected-card")[0].classList.remove("selected-card");
        document.getElementById("card-listing-ul").getElementsByClassName("selected-list")[0].classList.remove("selected-list");
      }
    });

    seekbar.addEventListener("click", (e) => {
      const percent = e.offsetX / seekbar.offsetWidth;
      currentSong.currentTime = percent * currentSong.duration;
    });
  }

  function volumeController(e) {
    if (e.target.value == 100) {
      alert("You raised volume too high , risky for your health!!");
    }
    if (e.target.value == 0) {
      alert("You reduced volume too much , its muted.");
    }
    currentSong.volume = e.target.value / 100;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function capitalizeWords(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  function init() {
    renderSongList();
    cardListRendering();
    defaultCardRendering();
    setupPlayButton();
    setupLoopToggle();
    setupSeekbar();
    renderDailyMix();
    document.getElementById("song-about").textContent = "NO SONG LOADED !!!!";
  }

  document.getElementsByClassName("search")[0].addEventListener("click", () => {
    document.getElementsByClassName("home-page")[0].style.display = "none";
    document.getElementsByClassName("home")[0].style.color = "#b3b3b3";
    document.getElementsByClassName("search-html")[0].style.display = "block";
    document.getElementsByClassName("search")[0].style.color = "#169b3a";
  })
  document.getElementsByClassName("home")[0].addEventListener("click", () => {
    document.getElementsByClassName("home-page")[0].style.display = "block";
    document.getElementsByClassName("home")[0].style.color = "#169b3a";
    document.getElementsByClassName("search-html")[0].style.display = "none";
    document.getElementsByClassName("search")[0].style.color = "#b3b3b3";
  })
  document.getElementById('searchbox').addEventListener('input', () => { searching() });
  document.getElementById('myRange').addEventListener('input', (e) => { volumeController(e) });
  document.getElementsByClassName('Next')[0].addEventListener('click', () => { setupNextButton() })
  document.getElementsByClassName('previous')[0].addEventListener('click', () => { setupPrevButton() })
  init();

}
main()