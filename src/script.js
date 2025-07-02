function mainMobile() {
  async function main() {
    showLoader();
    const data = await (await fetch("/resources/Data_Modules/DATA.json")).json();
    const artistData = (await (await fetch("/resources/Data_Modules/artistData.json")).json())["artists"];
    hideLoader();
    let currentSong = new Audio();
    let currentSongIndex = null;
    let currentSongLi = null;
    let currentSrc = null;
    let loop = false;
    let shuffle = false
    let songs = (Array.from(data)).map((eachSongObject) => eachSongObject.songName);
    let previousActiveIcon = null;
    const artistNames = (Array.from(data)).map((eachSongObject) => eachSongObject.artist);
    const playButton = document.querySelector(".Play");
    const playButtonMobile = document.getElementById('PLay');
    const recentList = [];
    let iconPageMapping = {
      "home": {
        "page": "home-page",
        "display": "block"
      },
      "search": {
        "page": "search-html",
        "display": "block"
      },
      "library": {
        "page": "side",
        "display": "block"
      },
      "player-page": {
        "page": "player",
        "display": "flex"
      }
    }

    function wishingUser() {
      const time = new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata'
      }).toUpperCase();
      let currentHour = Number(time.split(':')[0]);
      const welcomeWish = time.includes("PM") ? (currentHour <= 4 || currentHour == 12) ? "Lazy Noon😑" : currentHour <= 9 ? "Relaxed Evening😌" : "Sleepy Mood😪" : (currentHour <= 4 || currentHour == 12) ? "Good night😴" : "Good Morning😊"
      document.getElementById("statusWishes").children[0].innerText = welcomeWish;
    }
    async function playSong(track) {
      return new Promise((resolve, reject) => {
        try {
          currentSong.src = `/resources/Songs/${track}`;
          currentSong.play().then(() => {
            resolve(200);
          }).catch(() => {
            reject(400);
          })
        } catch (error) {
          console.log("Playback Failed :", error);
          reject(404);
        }
      })
    }

    function loadingWindowFunctions() {
      window.addEventListener('load',
        () => {
          const initialPage = '';
          Navigation(initialPage);
          history.replaceState({
            page: initialPage
          }, '', `#${initialPage}`);
        });
      window.addEventListener('popstate', (event) => {
        const page = event.state?.page || location.hash.replace('#', '') || 'home';
        Navigation(page);
        if(document.getElementsByClassName('player')[0] && document.getElementsByClassName('player')[0].style.display != "none") document.getElementsByClassName('player')[0].style.display = "none";
        if(document.querySelector('.artist-float-card') && document.querySelector('.artist-float-card').style.display != "none") {
          document.querySelector('.artist-float-card').style.display = "none";
          document.querySelector('.container').style.filter = "brightness(100%)";
          document.querySelector('.container').style.opacity = "100%";
        }
      });
    }

    function appReloader() {
      window.addEventListener('load',
        () => {
          const targetPath = '/'; // change to your desired route
          if(window.location.pathname !== targetPath) {
            window.location.href = targetPath;
          }
        });
    }

    function showLoader() {
      document.getElementById("loader-overlay")?.classList.add("show");
      document.querySelector('.search-html').appendChild(document.getElementById("loader-overlay"));
    }

    function hideLoader() {
      document.getElementById("loader-overlay")?.classList.remove("show");
    }

    function showFooterLoader() {
      if(document.getElementById('loaderFooter')) {
        document.getElementById('loaderFooter').classList.add('animateLoader');
      }
    }

    function showSearchLoader() {
      if(document.getElementById('searchLoaderOverlay')) {
        document.getElementById('searchLoaderOverlay').style.display = "block";
      }
    }

    function hideSearchLoader() {
      if(document.getElementById('searchLoaderOverlay')) {
        document.getElementById('searchLoaderOverlay').style.display = "none";
      }
    }

    function showControllerLoader() {
      if(document.querySelector('#controllerLoader')) {
        document.getElementById('controllerLoader').style.display = "block";
      }
    }

    function hideControllerLoader() {
      if(document.querySelector('#controllerLoader')) {
        document.getElementById('controllerLoader').style.display = "none";
      }
    }

    function hideFooterLoader() {
      if(document.getElementById('loaderFooter')) {
        document.getElementById('loaderFooter').classList.remove('animateLoader');
      }
    }

    function showTopResultLoader() {
      if(document.querySelector('.song-card')) {
        document.querySelector('.song-card').classList.add('animateLoader');
      }
    }

    function hideTopResultLoader() {
      if(document.querySelector('.song-card')) {
        document.querySelector('.song-card').classList.remove('animateLoader');
      }
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
          <img loading="lazy" class="svgs-new" src="/resources/SVGS/play-circle-svgrepo-com.svg" alt="">
        </div>
      `;
        li.addEventListener("click", () => handleSongClick(index));
        songListEl.appendChild(li);
      });
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

    function volumeAlert() {
      let lastVolume = currentSong.volume ? currentSong.volume : null;
      const threshold = 0.8;
      currentSong.addEventListener('volumechange', () => {
        console.log("volume changes");
        if(currentSong.volume > lastVolume) {
          alert("Volume increased!");
          if(currentSong.volume >= threshold) {
            alert("⚠️ Warning: Volume is too high!");
          }
        }
      })
      lastVolume = currentSong.volume;
    }

    function Navigation(page) {
      if(!iconPageMapping[page]) {
        console.warn(`Navigation: Invalid page "${page}" passed`);
        return;
      }
      const navItem = Array.from((document.getElementsByClassName('navbar'))[0].children);
      navItem.push(document.getElementsByClassName('footer')[0]);
      navItem.forEach((currentNavItem) => {
        if(currentNavItem.id != "premium") {
          const mapping = iconPageMapping[currentNavItem.id];
          if(page != "library" && mapping && document.getElementsByClassName(mapping.page)[0]) {
            document.getElementsByClassName(mapping.page)[0].style.display = "none";
          }
          if(currentNavItem.id != "player-page") {
            currentNavItem.classList.remove('active');
            currentNavItem.firstElementChild.firstElementChild.classList.remove('active-path');
          }
        }
      });
      if(page != "premium") {
        const mapping = iconPageMapping[page];
        const target = document.getElementsByClassName(mapping.page)[0];
        if(target) {
          target.style.display = mapping.display;
        }
        if(page != 'player-page') {
          const element = document.getElementById(page);
          if(element) {
            element.classList.add('active');
            element.firstElementChild.firstElementChild.classList.add('active-path');
          }
        }
      }
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    function navigateTo(page) {
      if(page == "premium") return;
      Navigation(page);
      history.pushState({
        page
      }, '', `${page}`);
    }
    async function createCard(song, index) {
      try {
        const duration = song.duration;
        const ul = document.getElementById('card-listing-ul');
        let newLi = document.createElement('li');
        newLi.setAttribute('class', 'card-list-li');
        newLi.setAttribute("id", index);
        newLi.innerHTML = `
        <div class="li-flex">
        <img loading="lazy" src="./resources/Posters/${song.poster}" alt=""
            class="card-list-img">
        <div class="card-list-details">
            <div class="song-name">${song.songName.replace(".mp3", "")}</div>
            <div class="artist-name-card-list">${song.artist}</div>
        </div>
        </div>
        <div class="extras">
        <div class="duration">${duration}</div>
        </div>`
        newLi.addEventListener('click', () => {
          let clickedSongName = newLi.children[0].children[1].children[0].innerText.toString().concat(".mp3");
          data.forEach((eachSongObject) => {
            if(clickedSongName == eachSongObject.songName) {
              return handleSongClick(eachSongObject.id);
            }
          })
        })
        return newLi;
      } catch (error) {
        console.log(error);
      }
    }
    async function createArtistCard(artist) {
      const parentDiv = document.querySelector('.artist-card-section').children[1];
      const div = document.createElement('div');
      div.setAttribute("class", "artist-card");
      div.setAttribute("data-name", artist.name); // safer than matching image src
      div.innerHTML = `
        <div class="artist-image"><img loading="lazy" src="${artist.poster}" alt=""></div>
        <div class="text">
          <div class="artist-name">${artist.name}</div>
          <div class="artist-text">${artist.artist_work}</div>
        </div>
      `;
      div.addEventListener('click', function(e) {
        const artistName = e.currentTarget.getAttribute("data-name");
        const artistObject = artistData.find(a => a.name === artistName);
        if(artistObject) {
          createArtistDescriptionCard(artistObject);
        } else {
          alert("Artist object not found");
        }
      });
      parentDiv.appendChild(div);
    }

    function topResultCreateCard(song, index) {
      const grandParent = document.getElementById('grandParent');
      grandParent.innerHTML = '';
      const parentDiv = document.createElement('div');
      parentDiv.setAttribute('class', 'song-card');
      parentDiv.innerHTML = `
          <img loading="lazy" id ="topResultImage"src="/resources/Posters/${song.poster}" alt="Song Cover">
          <div class="song-details marquee-container">
              <h1 class="gaane marquee-text">${song.songName.replace(".mp3", "")}</h1>
              <div class="artist-name marquee-container">
                  <div class="marquee-text" id="topResultCardArtistName">${song.artist} </div>
                  <span id="playBtn" class="Play-now" id="${index}" style="float: right;">Play Now</span>
              </div>
  
          </div>
          `
      grandParent.appendChild(parentDiv);
      let widthPercent = (document.getElementById('topResultCardArtistName').clientWidth / document.getElementById('topResultCardArtistName').parentElement.clientWidth) * 100
      if(widthPercent > 95) document.getElementById('topResultCardArtistName').classList.add('scroll');
      widthPercent = (document.getElementsByClassName('gaane')[0].clientWidth / document.getElementsByClassName('gaane')[0].parentElement.clientWidth) * 100;
      if(widthPercent > 95) {
        document.getElementsByClassName('gaane')[0].classList.add('scroll');
      }
      document.getElementById('playBtn').addEventListener('click', (e) => {
        let clickedSongName = e.target.parentElement.parentElement.children[0].innerText.concat(".mp3");
        data.forEach((eachSongObject) => {
          if(clickedSongName == eachSongObject.songName) {
            handleSongClick(eachSongObject.id).then(
              () => {
                document.getElementsByClassName('song-card')[0].classList.add("selected-card");
              })
          }
        })
      });
      let songCardText = parentDiv.children[1].children[0].innerText;
      let currentSongName = currentSong.src ? (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "") : null;
      if(songCardText == currentSongName && document.getElementsByClassName('selected').length == 1) {
        document.getElementsByClassName('song-card')[0].classList.add('selected-card');
      }
    }

    function createArtistDescriptionCard(artist) {
      if(!artist || !artist.poster || !artist.name) {
        alert("Invalid artist object!");
        return;
      }
      const body = document.querySelector('body');
      const topSongs = artist.topSongs.join(", ");
      const genre = artist.genres.join(", ");
      const wrapper = document.createElement('div');
      wrapper.className = 'artist-card-wrapper';
      wrapper.style.position = 'fixed';
      wrapper.style.top = '0';
      wrapper.style.left = '0';
      wrapper.style.width = '100%';
      wrapper.style.height = '100%';
      wrapper.style.zIndex = '999';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      const artistDescriptionCard = document.createElement('div');
      artistDescriptionCard.className = 'artist-float-card';
      artistDescriptionCard.style.backgroundImage = `url(${artist.poster})`;
      artistDescriptionCard.style.backgroundRepeat = `no-repeat`;
      artistDescriptionCard.style.backgroundSize = `cover`;
      artistDescriptionCard.style.backdropFilter = `blur(5px)`;
      artistDescriptionCard.style.zIndex = "1000";
      artistDescriptionCard.innerHTML = `
        <span id="close-card" class="close-btn">×</span>
        <div class="artist-details">
          <h2>${capitalizeWords(artist.name)}</h2>
          <p>${artist.para}</p>
          <ul>
            <li><strong>Top Songs:</strong> ${topSongs}</li>
            <li><strong>Spotify Listeners:</strong> ${artist.monthlyListeners} monthly</li>
            <li><strong>Genres:</strong> ${genre}</li>
            <li><strong>Awards:</strong> ${artist.awards}</li>
            <li><strong>Years Active:</strong> ${artist.activeYears}</li>
          </ul>
        </div>
      `;
      wrapper.appendChild(artistDescriptionCard);
      const container = document.querySelector('.container');
      if(container) {
        container.style.filter = "brightness(20%)";
        container.style.opacity = "0%";
      }
      body.appendChild(wrapper);
      document.body.style.overflow = "hidden";
      document.getElementById('close-card').addEventListener('click',
        () => {
          wrapper.remove();
          document.body.style.overflow = "";
          if(container) {
            container.style.filter = "brightness(100%)";
            container.style.opacity = "100%";
          }
        });
      wrapper.addEventListener('click', (e) => {
        if(!artistDescriptionCard.contains(e.target)) {
          wrapper.remove();
          document.body.style.overflow = "";
          if(container) {
            container.style.filter = "brightness(100%)";
            container.style.opacity = "100%";
          }
        }
      });
    }
    let renderToken = 0;
    async function cardListRendering(filteredArray) {
      showSearchLoader();
      const ul = document.getElementById('card-listing-ul');
      if(!ul) return;
      const currentToken = ++
      renderToken;
      ul.innerHTML = "";
      try {
        const fragment = document.createDocumentFragment();
        const cardElements = [];
        for(let i = 0; i < filteredArray.length; i++) {
          if(renderToken !== currentToken) return;
          const cardEl = await createCard(filteredArray[i], i);
          if(cardEl) {
            cardElements.push(cardEl);
            fragment.appendChild(cardEl);
          }
        }
        ul.appendChild(fragment); // append all at once
        const currentSongName = currentSong.src ? currentSong.src.split("/").pop().replaceAll("%20", " ") : null;
        cardElements.forEach(cardEl => {
          const cardSongName = cardEl.querySelector(".song-name").innerText + ".mp3";
          if(cardSongName === currentSongName) {
            cardEl.classList.add("selected-list");
          } else {
            cardEl.classList.remove("selected-list");
          }
        });
        Array.from(document.getElementsByClassName('artist-name-card-list')).forEach(el => {
          const width_percentage = (el.clientWidth / el.parentElement.clientWidth) * 100;
          if(width_percentage > 95) el.classList.add('scroll');
        });
      } catch (error) {
        console.error("Error rendering cards:", error);
      }
      const images = document.querySelector('.search-html').querySelectorAll("img");
      const imagePromises = Array.from(images).map(img => img.complete ? Promise.resolve() : new Promise(resolve => img.onload = img.onerror = resolve));
      await Promise.all(imagePromises);
      hideSearchLoader();
    }
    let cardRenderIndex = 0;
    const cardsPerBatch = 10;
    let allCardsRendered = false;
    let isRendering = false;
    async function lazyDefaultCardRendering() {
      const data = await (await fetch("/resources/Data_Modules/DefaultCardData.json")).json();
      const browseSection = document.querySelector(".browse-section");
      if(!browseSection) return;

      function renderBatch() {
        if(allCardsRendered || isRendering) return; // 💡 Prevent overlapping renders
        isRendering = true;
        const fragment = document.createDocumentFragment();
        for(let i = 0; i < cardsPerBatch && cardRenderIndex < 100; i++, cardRenderIndex++) {
          const currentDataCard = data[cardRenderIndex % data.length];
          const card = document.createElement("div");
          card.className = "browse-all-cards";
          card.innerHTML = `
            <p class="genre">${currentDataCard.title}</p>
            <img loading="lazy" class="rotate-img" src="${currentDataCard.image}" alt="">
          `;
          fragment.appendChild(card);
        }
        browseSection.appendChild(fragment);
        coloringTheCards();
        if(cardRenderIndex >= 100) {
          allCardsRendered = true;
        }
        isRendering = false;
      }
      renderBatch();
      browseSection.addEventListener("scroll",
        () => {
          if(!allCardsRendered && !isRendering && browseSection.scrollTop + browseSection.clientHeight >= browseSection.scrollHeight - 100) {
            renderBatch();
          }
        });
    }
    async function artistCardRendering(filteredArtist) {
      try {
        const artistSection = document.querySelector('.artist-card-section');
        if(filteredArtist.length != 0) {
          artistSection.innerHTML = `
                  <h2>Artists</h2>
                  <div class="artist-card-section-flex"></div>
                  `
          for(const artistObject of filteredArtist) {
            await createArtistCard(artistObject)
          }
        } else artistSection.innerHTML = "";
      } catch (error) {
        console.log(error);
      }
    }
    async function renderDailyMix() {
      const dailyMixCards = Array.from(document.getElementsByClassName('made-box-card'));
      if(!artistData || artistData.length === 0) return;
      const startIndex = Math.floor(Math.random() * artistData.length);
      for(let i = 0; i < dailyMixCards.length; i++) {
        const currentCard = dailyMixCards[i];
        const artist = artistData[(startIndex + i) % artistData.length];
        if(artist && artist.poster) {
          const poster = artist.poster.trim();
          currentCard.style.backgroundImage = `url('${poster}')`;
          currentCard.style.backgroundRepeat = "no-repeat";
          currentCard.style.backgroundSize = "cover";
          currentCard.style.backgroundBlendMode = "soft-light";
          currentCard.style.backgroundColor = "#80808082"
        } else {
          console.warn("Missing artist or poster at index", i);
        }
        currentCard.addEventListener('click',
          () => {
            alert('LogIn for personalized daily mix.');
          })
      }
    }

    function searching() {
      const currentInput = document.getElementById('searchbox').value.toLowerCase().trim();
      const defaultBox = document.getElementById('default');
      const artistSection = document.querySelector('.artist-card-section');
      const searchSection = document.getElementById('searchup');
      const mainContent = document.getElementsByClassName('main-content')[0];
      const unavailable = document.getElementsByClassName('unavailable')[0];
      if(!currentInput) {
        document.getElementById('classingList').innerHTML = `<ul id="card-listing-ul"></ul>`;
        defaultBox.style.display = "block";
        searchSection.style.display = "none";
        artistSection.innerHTML = "";
        return;
      }
      let matchingSongList = data.filter(song => song.songName.toLowerCase().startsWith(currentInput));
      if(matchingSongList.length == 0) {
        matchingSongList = data.filter(song => song.songName.toLowerCase().includes(currentInput));
      }
      let matchingArtistList = artistData.filter(artist => artist.name.toLowerCase().startsWith(currentInput));
      if(matchingArtistList.length == 0) {
        matchingArtistList = artistData.filter(artist => artist.name.toLowerCase().includes(currentInput))
      }
      if(matchingSongList.length > 0) {
        defaultBox.style.display = "none";
        mainContent.style.display = "flex";
        unavailable.style.display = "none";
        document.querySelectorAll(".Headings").forEach(el => el.style.display = "flex");
        searchSection.style.display = "flex";
        cardListRendering(matchingSongList);
        const topResult = matchingSongList[0];
        topResultCreateCard(topResult, 0);
      } else if(matchingArtistList.length > 0) {
        defaultBox.style.display = "none";
        mainContent.style.display = "flex";
        unavailable.style.display = "none";
        console.log("else if");
      } else {
        defaultBox.style.display = "none";
        searchSection.style.display = 'none';
        unavailable.style.display = 'block';
        document.querySelectorAll(".Headings").forEach(el => el.style.display = "none");
        console.log("else");
      }
      artistCardRendering(matchingArtistList);
    }

    function handleSongClick(index) {
      return new Promise((resolve, reject) => {
        try {
          showFooterLoader();
          showControllerLoader();
          if(index == currentSongIndex) {
            hideFooterLoader();
            hideControllerLoader();
            hideTopResultLoader();
            if(currentSong.paused) {
              alert("The song you choosed is already loaded on your track, control it via player");
            } else {
              alert("The song is playing already");
            }
            return
          }
          currentSrc = songs[index];
          if(document.querySelector('.gaane') && document.querySelector('.gaane').innerText.trim().toLowerCase() == currentSrc.split('.mp3')[0].trim().toLowerCase()) {
            showTopResultLoader();
          }
          document.querySelector('.container').style.marginBottom = "10%";
          if(currentSongLi) {
            currentSongLi.classList.remove("selected-list");
          }
          if(currentSongIndex !== null && !loop) {
            const prevLi = document.getElementById(currentSongIndex);
            prevLi.classList.remove("selected");
            prevLi.querySelector(".playbutton img").src = "/resources/SVGS/play-circle-svgrepo-com.svg";
          }
          playSong(currentSrc).then(() => {
            updateUI(index);
            updateSongAbout(index);
            updateFooter(updateControllerPage);
            updateRecentList(index);
            if(document.getElementsByClassName('song-card').length != 0) {
              let songCardText = document.getElementsByClassName('song-card')[0].children[1].children[0].innerText;
              let currentSongName = (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "");
              if(songCardText != currentSongName) {
                document.getElementsByClassName('song-card')[0].classList.remove('selected-card');
              } else {
                document.getElementsByClassName('song-card')[0].classList.add('selected-card');
              }
            }
            if(document.getElementsByClassName('card-list-li').length != 0) {
              let currentSongName = (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "");
              Array.from(document.getElementsByClassName('card-list-li')).forEach((currentSongList) => {
                if(currentSongList.children[0].children[1].children[0].innerText == currentSongName) {
                  currentSongList.classList.add("selected-list");
                } else {
                  currentSongList.classList.remove("selected-list");
                }
              })
            }
            hideFooterLoader();
            hideControllerLoader();
            hideTopResultLoader();
            resolve();
          })
          playButton.querySelector("img").src = "/resources/SVGS/pause.svg";
        } catch (error) {
          reject(error);
        }
      })
    }

    function updateSongAbout(index) {
      if(!document.getElementById('song-name')) {
        document.getElementById("song-about").innerHTML = `
        <div id="song-name" data-song-id = ${index}>
          <div class="poster">
            <img loading="lazy" class="svgs1" src="/resources/Posters/${data[index].poster}" alt="">
          </div>
          <div class="marquee-container content">
            <div class="song-name-poster marquee-text">${songs[index].replace(".mp3", "")}</div>
            <div class="marquee-text artist-name-poster">${artistNames[index]}</div>
          </div>
        </div>
      `;
      } else {
        let parent = document.querySelector('#song-name');
        parent.dataset.songid = index;
        parent.firstElementChild.firstElementChild.src = `/resources/Posters/${data[index].poster}`;
        parent.children[1].children[0].innerText = songs[index].replace(".mp3", "");
        parent.children[1].children[1].innerText = artistNames[index];
      }
    }

    function updateUI(index) {
      currentSongIndex = index;
      currentSongLi = document.getElementById(index);
      currentSongLi.classList.add("selected-list");
      currentSongLi.classList.add("selected");
      currentSongLi.querySelector(".playbutton img").src = "/resources/SVGS/pause.svg";
      document.getElementById('mobilePlayButton').firstElementChild.src = "/resources/SVGS/pause-footer.svg";
      currentSongLi.querySelector(".playbutton img").style.filter = "invert(1)";
    }
    async function getDominantColor(imgElement) {
      return new Promise((resolve, reject) => {
        const colorThief = new ColorThief();
        if(!imgElement.complete || imgElement.naturalWidth === 0) {
          imgElement.onload = () => {
            try {
              const color = colorThief.getColor(imgElement);
              resolve(color);
            } catch (err) {
              reject("Color extraction failed after image load.");
            }
          };
          return;
        }
        try {
          const color = colorThief.getColor(imgElement);
          resolve(color);
        } catch (err) {
          reject("Color extraction failed.");
        }
      });
    }

    function updateRecentList(index) {
      let recentCardMaxElementSize = 0;
      if(window.screen.width > 426) recentCardMaxElementSize = 6;
      else recentCardMaxElementSize = 3;
      if(!recentList.includes(index)) {
        if(recentList.length >= recentCardMaxElementSize) recentList.shift();
        recentList.push(index);
        renderRecentCards();
      }
    }

    function updateFooter(callBackF) {
      if(currentSong.src != null) {
        callBackF();
        let footer = document.getElementsByClassName("footer")[0];
        let player = document.getElementsByClassName('player')[0];
        let img = footer.children[1].children[0].children[0].children[0];
        getDominantColor(img).then((rgb) => {
          const newColor = normalizeColor(rgb[0], rgb[1], rgb[2], 0.3, 0.6);
          footer.style.background = newColor;
          player.style.background = `linear-gradient(180deg, ${newColor} 40%, black 150%)`;
        }).catch((err) => {
          console.error("Color extraction failed:", err);
        });
        footer.style.display = "flex";
        let widthPercent = (document.getElementsByClassName('artist-name-poster')[0].clientWidth / document.getElementsByClassName('artist-name-poster')[0].parentElement.clientWidth) * 100;
        if(widthPercent > 100) {
          document.getElementsByClassName('artist-name-poster')[0].classList.add('scroll');
        }
        widthPercent = (document.getElementsByClassName('song-name-poster')[0].clientWidth / document.getElementsByClassName('song-name-poster')[0].parentElement.clientWidth) * 100;
        if(widthPercent > 100) {
          document.getElementsByClassName('song-name-poster')[0].classList.add('scroll')
        }
      }
    }

    function renderRecentCards() {
      const container = document.querySelector(".recent-container");
      container.innerHTML = "";
      container.style.justifyContent = "flex-start";
      recentList.forEach(index => {
        const card = document.createElement("div");
        card.className = "song-card-div";
        card.dataset.songId = index;
        card.innerHTML = `
              <div class="song-carding">
                <div class="poster-song">
                  <img loading="lazy" src="/resources/Posters/${(data[index].poster)}" alt="">
                </div>
                <div class="about-song-card">${(songs[index].replace(".mp3", "").split("(")[0])}</div>
              </div>
            `;
        card.addEventListener('click', function(event) {
          handleSongClick(Number(event.currentTarget.dataset.songId));
        })
        container.prepend(card);
      });
    }

    function updateControllerPage() {
      if(!document.getElementById('controller-page')) {
        const controllerPage = document.createElement('div');
        controllerPage.setAttribute('id', 'controller-page');
        const seekParent = document.createElement('div');
        seekParent.setAttribute('class', 'seek-parent');
        let seekSection = document.getElementById('seeksection');
        let seek = (document.getElementsByClassName('seek')[0]);
        let seekRocker = document.getElementById('seekRocker');
        var dummySeekBar = document.createElement('div');
        dummySeekBar.setAttribute('id', 'dummySeekBar');
        dummySeekBar.innerHTML = `<div id="dummy-seek-rocker"></div>`
        seekParent.appendChild(seekRocker);
        seekParent.appendChild(seek);
        controllerPage.innerHTML = `
        <div class="player">
        <div class="header-controller">
          <span ><img loading="lazy" id="close-controller" height="10px" src = "/resources/svgs/close.svg"/></span>
          <p class="song-info">2000's Gold</p>
          <span>⋯</span>
        </div>
        <img loading="lazy" src="/resources/Posters/${data[currentSongIndex].poster}"} alt="Album Art" class="album-art">
        <div class="song-details-player">
          <h2>${data[currentSongIndex].songName.split('.mp3')[0]}</span></h2>
          <p>${data[currentSongIndex].artist}</p>
        </div>
        `
        document.body.appendChild(controllerPage);
        document.getElementsByClassName('player')[0].appendChild(seekParent);
        document.getElementsByClassName('player')[0].appendChild(seekSection);
        document.getElementsByClassName('footer')[0].appendChild(dummySeekBar);
      } else {
        document.getElementsByClassName('album-art')[0].src = `/resources/Posters/${data[currentSongIndex].poster}`;
        document.getElementsByClassName('song-details-player')[0].children[0].innerText = data[currentSongIndex].songName.split('.mp3')[0];
        document.getElementsByClassName('song-details-player')[0].children[1].innerText = data[currentSongIndex].artist;
      }
    }
    const colorCard = (array) => {
      array.forEach((element) => {
        let random_red = Math.random() * (100);
        let random_green = Math.random() * (100);
        let random_blue = Math.random() * (100);
        element.style.background = `rgb(${random_red}, ${random_green}, ${random_blue})`;
      })
    }
    const coloringTheCards = () => {
      let card_array = Array.from(document.getElementsByClassName('browse-all-cards'));
      colorCard(card_array);
    }

    function setupPlayButton() {
      playButton.addEventListener("click", () => {
        if(!currentSong.src) return alert("Please Load any song from the playlist before running the track.");
        const isPaused = currentSong.paused;
        const icon = playButton.querySelector("img");
        const currentLi = document.getElementById(currentSongIndex);
        if(isPaused) {
          currentSong.play();
          currentSongLi.classList.add("selected");
          if(document.getElementsByClassName('song-card').length != 0) {
            if(document.getElementsByClassName('song-card')[0].children[1].firstElementChild.innerText.toLowerCase() == currentSrc.split('.mp3')[0].toLowerCase()) {
              document.getElementsByClassName('song-card')[0].classList.add("selected-card");
            }
          }
          icon.src = "/resources/SVGS/pause.svg";
          currentLi.querySelector(".playbutton img").src = "/resources/SVGS/pause.svg";
          document.getElementById('mobilePlayButton').firstElementChild.src = "/resources/SVGS/pause-footer.svg"
          currentLi.querySelector(".playbutton img").style.filter = "invert(1)";
          if(document.getElementsByClassName('card-list-li').length != 0) {
            let currentSongName = (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "");
            Array.from(document.getElementsByClassName('card-list-li')).forEach((currentSongList) => {
              if(currentSongList.children[0].children[1].children[0].innerText == currentSongName) {
                currentSongList.classList.add("selected-list");
              } else {
                currentSongList.classList.remove("selected-list");
              }
            })
          }
        } else {
          currentSong.pause();
          currentSongLi.classList.remove("selected");
          if(document.getElementsByClassName('song-card').length != 0) {
            document.getElementsByClassName('song-card')[0].classList.remove("selected-card");
          }
          icon.src = "/resources/SVGS/play.svg";
          currentLi.querySelector(".playbutton").firstElementChild.src = "/resources/SVGS/play-circle-svgrepo-com.svg";
          document.getElementById('mobilePlayButton').firstElementChild.src = "/resources/SVGS/play-footer.svg"
          if(document.getElementsByClassName('card-list-li').length != 0) {
            Array.from(document.getElementsByClassName('card-list-li')).forEach((currentSongList) => {
              currentSongList.classList.remove("selected-list");
            })
          }
        }
      });
    }

    function setupPlayFooter() {
      document.getElementById('mobilePlayButton').addEventListener('click', (event) => {
        console.log("pressed");
        event.stopPropagation();
        playButton.click();
        if(currentSong.paused) {
          document.getElementById('mobilePlayButton').firstElementChild.src = "/resources/svgs/play-footer.svg"
        } else {
          document.getElementById('mobilePlayButton').firstElementChild.src = "/resources/svgs/pause-footer.svg"
        }
      })
    }

    function setupNextButton() {
      let currentSongName = currentSong.src.toString().split('/')[5].replaceAll("%20", " ");
      let currentSongObject = data.filter((eachSongObject) => {
        if(eachSongObject.songName == currentSongName) return eachSongObject
      });
      let index = currentSongObject[0].id == (data.length - 1) ? 0 : currentSongObject[0].id + 1;
      handleSongClick(index);
    }

    function setupPrevButton() {
      let currentSongName = currentSong.src.toString().split('/')[5].replaceAll("%20", " ");
      let currentSongObject = data.filter((eachSongObject) => {
        if(eachSongObject.songName == currentSongName) return eachSongObject
      });
      let index = currentSongObject[0].id == 0 ? (data.length - 1) : currentSongObject[0].id - 1;
      handleSongClick(index);
    }

    function setupLoopToggle() {
      document.querySelector(".loop1").addEventListener("click",
        () => {
          loop = !loop;
          if(shuffle) shuffle = !loop;
          currentSong.loop = loop;
          document.querySelector('.loop1').firstElementChild.src = loop ? "resources/svgs/loop1.svg" : "resources/svgs/loop.svg";
          document.querySelector(".shuffle").firstElementChild.src = shuffle ? "resources/svgs/shuffle1.svg" : "resources/svgs/shuffle.svg";
        });
    }

    function setupShuffleToggle() {
      document.querySelector(".shuffle").addEventListener("click", (event) => {
        shuffle = !shuffle;
        if(loop) loop = !shuffle;
        currentSong.loop = loop;
        document.querySelector(".shuffle").firstElementChild.src = shuffle ? "resources/svgs/shuffle1.svg" : "resources/svgs/shuffle.svg";
        document.querySelector('.loop1').firstElementChild.src = loop ? "resources/svgs/loop1.svg" : "resources/svgs/loop.svg";
      });
    }

    function setupSeekbar() {
      const rocker = document.getElementById("seekRocker");
      rocker.addEventListener('change', (e) => {
        const percent = (e.target.value / 100);
        currentSong.currentTime = percent * currentSong.duration;
      });
      currentSong.addEventListener("timeupdate", () => {
        if(!currentSong.duration) return;
        const percentage = currentSong.currentTime / currentSong.duration;
        rocker.value = percentage * 100;
        const val = (rocker.value - rocker.min) / (rocker.max - rocker.min) * 100;
        rocker.style.background = `linear-gradient(to right, #ffffff 0%, #ffffff ${val}%, rgba(255,255,255,0.2) ${val}%, rgba(255,255,255,0.2) 100%)`;
        document.getElementById('dummy-seek-rocker').style.width = `${rocker.value}%`;
        document.getElementById("current-time").textContent = formatTime(currentSong.currentTime);
        document.getElementById("current-duration").textContent = formatTime(currentSong.duration);
        if(percentage == 1 && !loop) {
          if(shuffle) {
            handleSongClick(Math.floor(Math.random() * songs.length));
          } else {
            const prevLi = document.getElementById(currentSongIndex);
            prevLi.classList.remove("selected");
            prevLi.querySelector(".playbutton img").src = "/resources/SVGS/play-circle-svgrepo-com.svg";
            document.querySelector('.Play').children[0].src = '/resources/SVGS/play.svg';
            document.querySelector('#mobilePlayButton').children[0].src = '/resources/SVGS/play-footer.svg';
            rocker.value = 0;
            document.getElementById('dummy-seek-rocker').style.width = `${rocker.value}%`;
            if(document.getElementsByClassName('selected-card').length != 0) document.getElementsByClassName("selected-card")[0].classList.remove("selected-card");
            document.getElementById("card-listing-ul").getElementsByClassName("selected-list")[0].classList.remove("selected-list");
          }
        }
      });
    }

    function volumeController(e) {
      if(e.target.value == 100) {
        alert("You raised volume too high , risky for your health!!");
      }
      if(e.target.value == 0) {
        alert("You reduced volume too much , its muted.");
      }
      currentSong.volume = e.target.value / 100;
    }

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60).toString()
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }

    function capitalizeWords(str) {
      return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    function normalizeColor(r, g, b, targetLightMin = 0.4, targetLightMax = 0.6) {
      let rNorm = r / 255;
      let gNorm = g / 255;
      let bNorm = b / 255;
      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      const delta = max - min;
      let l = (max + min) / 2;
      let s = 0;
      if(delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));
      }
      let h = 0;
      if(delta !== 0) {
        if(max === rNorm) {
          h = ((gNorm - bNorm) / delta) % 6;
        } else if(max === gNorm) {
          h = ((bNorm - rNorm) / delta) + 2;
        } else {
          h = ((rNorm - gNorm) / delta) + 4;
        }
        h *= 60;
        if(h < 0) h += 360;
      }
      if(l < targetLightMin) {
        l = targetLightMin; // Lighten too-dark colors
      } else if(l > targetLightMax) {
        l = targetLightMax; // Darken too-light colors
      }
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      let r1, g1, b1;
      if(0 <= h && h < 60) {
        [r1, g1, b1] = [c, x, 0];
      } else if(60 <= h && h < 120) {
        [r1, g1, b1] = [x, c, 0];
      } else if(120 <= h && h < 180) {
        [r1, g1, b1] = [0, c, x];
      } else if(180 <= h && h < 240) {
        [r1, g1, b1] = [0, x, c];
      } else if(240 <= h && h < 300) {
        [r1, g1, b1] = [x, 0, c];
      } else {
        [r1, g1, b1] = [c, 0, x];
      }
      return `rgba(${Math.round((r1 + m) * 255)},${Math.round((g1 + m) * 255)},${Math.round((b1 + m) * 255)},1)`;
    }

    function closeSide() {
      document.getElementsByClassName('closeButton-playlist')[0].addEventListener('click',
        () => {
          window.history.back();
        })
    }

    function openControllerPage() {
      document.getElementsByClassName('footer')[0].addEventListener('click',
        () => {
          document.getElementsByClassName('player')[0].style.display = "flex";
          document.body.classList.add("lock-scroll");
          document.documentElement.classList.add("lock-scroll");
        });
    }

    function actualClose() {
      document.body.addEventListener('click', (e) => {
        if(e.target && e.target.id === 'close-controller') {
          window.history.back();
          document.getElementsByClassName('player')[0].style.display = "none";
          document.body.classList.remove("lock-scroll");
          document.documentElement.classList.remove("lock-scroll");
        }
      });
    }

    function closeSideWhenTouchedOutside() {
      document.addEventListener('click', function(event) {
        let isClickedInsideSide = document.getElementsByClassName('side')[0].contains(event.target) || document.getElementsByClassName('libraryIcon')[0].contains(event.target);
        let isSideActive = document.getElementsByClassName('side')[0].style.display != 'none';
        if(!isClickedInsideSide && isSideActive) {
          window.history.back();
        }
      })
    }

    function debounce(fn, delay) {
      let fnTimerId;
      return function(...args) {
        clearTimeout(fnTimerId);
        fnTimerId = setTimeout(
          () => {
            fn.apply(this, args);
          }, delay);
      }
    }
    const debouncedSearching = debounce(searching, 500);

    function extraEssentialCalls() {
      document.getElementById('searchbox').addEventListener('input', debouncedSearching);
      document.getElementById('myRange').addEventListener('input', (e) => {
        volumeController(e)
      });
      document.getElementsByClassName('Next')[0].addEventListener('click', () => {
        setupNextButton()
      })
      document.getElementsByClassName('previous')[0].addEventListener('click',
        () => {
          setupPrevButton()
        })
      let navArray = Array.from(document.getElementsByClassName('navbar')[0].children);
      navArray.push(document.getElementsByClassName('footer')[0]);
      navArray.forEach(function(eachNavItem) {
        eachNavItem.addEventListener('click', () => {
          if(eachNavItem.id != 'premium') navigateTo(eachNavItem.id);
        })
      });
      document.getElementById('premium').addEventListener('click', function() {
        alert("Premium version will be available soon");
      })
    }

    function init() {
      wishingUser();
      loadingWindowFunctions();
      renderSongList();
      volumeAlert()
      lazyDefaultCardRendering();
      setupPlayButton();
      setupPlayFooter();
      setupLoopToggle();
      setupShuffleToggle();
      setupSeekbar();
      renderDailyMix();
      closeSide();
      appReloader();
      openControllerPage();
      actualClose();
      closeSideWhenTouchedOutside();
      extraEssentialCalls();
    }
    init();
  }
  main()
}

function mainLaptop() {
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
        <img loading="lazy" class="svgs-new" src="/resources/SVGS/play-circle-svgrepo-com.svg" alt="">
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
        for(const song of data) {
          const div = document.createElement('div');
          div.setAttribute('class', 'song-card');
          div.innerHTML = `
            <img loading="lazy" src="./resources/Posters/${song.poster}" alt="Song Cover">
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
    async function createCard(song, index) {
      try {
        const duration = song.duration;
        const ul = document.getElementById('card-listing-ul');
        let newLi = document.createElement('li');
        newLi.setAttribute('class', 'card-list-li');
        newLi.setAttribute("id", index);
        newLi.innerHTML = `
        <div class="li-flex">
        <img loading="lazy" src="./resources/Posters/${song.poster}" alt=""
            class="card-list-img">
        <div class="card-list-details">
            <div class="song-name">${song.songName.replace(".mp3", "")}</div>
            <div class="artist-name-card-list">${song.artist}</div>
        </div>
        </div>
        <div class="extras">
        <div class="duration">${duration}</div>
        </div>`
        newLi.addEventListener('click', () => {
          let clickedSongName = newLi.children[0].children[1].children[0].innerText.toString().concat(".mp3");
          data.forEach((eachSongObject) => {
            if(clickedSongName == eachSongObject.songName) {
              return handleSongClick(eachSongObject.id);
            }
          })
        })
        return newLi;
      } catch (error) {
        console.log(error);
      }
    }
    async function createArtistCard(artist) {
      const parentDiv = document.querySelector('.artist-card-section').children[1];
      const div = document.createElement('div');
      div.setAttribute("class", "artist-card");
      div.innerHTML = `
        <div class="artist-image"><img loading="lazy" src="${artist.poster}" alt=""></div>
        <div class="text">
            <div class="artist-name">${artist.name}</div>
            <div class="artist-text">${artist.artist_work}</div>
        </div>
        `
      div.addEventListener('click', function(e) {
        let localArtistData = null;
        let artistObject = null;
        fetch("/resources/Data_Modules/artistData.json").then((response) => response.json()).then((response) => {
          localArtistData = response["artists"];
          if(localArtistData) {
            localArtistData.forEach((eachArtistObject) => {
              let clickedSRC = e.target.src.slice(21).includes("%20") ? e.target.src.slice(21).replaceAll("%20", " ") : e.target.src.slice(21);
              if(clickedSRC == eachArtistObject.poster) artistObject = eachArtistObject
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
        <img loading="lazy" id ="topResultImage"src="/resources/Posters/${song.poster}" alt="Song Cover">
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
          if(clickedSongName == eachSongObject.songName) {
            return handleSongClick(eachSongObject.id);
          }
        })
        document.getElementsByClassName('song-card')[0].classList.add("selected-card");
      });
      let songCardText = parentDiv.children[1].children[0].innerText;
      let currentSongName = currentSong.src ? (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "") : null;
      if(songCardText == currentSongName && document.getElementsByClassName('selected').length == 1) {
        document.getElementsByClassName('song-card')[0].classList.add('selected-card');
      }
    }

    function createArtistDescriptionCard(artist) {
      if(!artist || !artist.topSongs || !artist.genres) {
        console.error("Invalid artist object:", artist);
        return;
      }
      const body = document.querySelector('body');
      let topSongs = " ";
      let genre = " ";
      (artist.topSongs).forEach((eachSong) => {
        topSongs += eachSong + " , "
      });
      (artist.genres).forEach((eachGenre) => {
        genre += eachGenre + " , "
      });
      const artistDescriptionCard = document.createElement('div');
      artistDescriptionCard.setAttribute('class', 'artist-float-card');
      artistDescriptionCard.innerHTML = `
    <span id="close-card" class="close-btn" >×</span>
  <img loading="lazy" src="${artist.poster}" alt="Arijit Singh">
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
      document.querySelector('.container').style.filter = "brightness(10%)";
      body.appendChild(artistDescriptionCard);
      document.getElementById('close-card').addEventListener('click',
        () => {
          document.querySelector('.artist-float-card').remove();
          document.querySelector('.container').style.filter = "brightness(100%)";
          document.querySelector('.container').style.opacity = "100%";
        });
    }
    let renderToken = 0;
    async function cardListRendering(filteredArray) {
      const ul = document.getElementById('card-listing-ul');
      if(!ul) return;
      const currentToken = ++
      renderToken;
      ul.innerHTML = "";
      try {
        const fragment = document.createDocumentFragment();
        const cardElements = [];
        for(let i = 0; i < filteredArray.length; i++) {
          if(renderToken !== currentToken) return;
          const cardEl = await createCard(filteredArray[i], i);
          if(cardEl) {
            cardElements.push(cardEl);
            fragment.appendChild(cardEl);
          }
        }
        ul.appendChild(fragment); // append all at once
        const currentSongName = currentSong.src ? currentSong.src.split("/").pop().replaceAll("%20", " ") : null;
        cardElements.forEach(cardEl => {
          const cardSongName = cardEl.querySelector(".song-name").innerText + ".mp3";
          if(cardSongName === currentSongName) {
            cardEl.classList.add("selected-list");
          } else {
            cardEl.classList.remove("selected-list");
          }
        });
        Array.from(document.getElementsByClassName('artist-name-card-list')).forEach(el => {
          const width_percentage = (el.clientWidth / el.parentElement.clientWidth) * 100;
          if(width_percentage > 95) el.classList.add('scroll');
        });
      } catch (error) {
        console.error("Error rendering cards:", error);
      }
    }
    async function defaultCardRendering() {
      const data = await (await fetch("/resources/Data_Modules/DefaultCardData.json")).json();
      const browseSection = document.querySelector('.browse-section');
      for(let i = 0; i < 100; i++) {
        let currentDataCard = data[i % data.length]
        let newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'browse-all-cards');
        newDiv.innerHTML = `
            <p class="genre">${currentDataCard.title}</p>
            <img loading="lazy" class="rotate-img" src="${currentDataCard.image}" alt="">
            `
        browseSection.appendChild(newDiv);
      }
      coloringTheCards();
    }
    async function artistCardRendering(filteredArtist) {
      try {
        console.log(filteredArtist);
        const artistSection = document.querySelector('.artist-card-section');
        if(filteredArtist.length != 0) {
          artistSection.innerHTML = `
                <h2>Artists</h2>
                <div class="artist-card-section-flex"></div>
                `
          for(const artistObject of filteredArtist) {
            await createArtistCard(artistObject)
          }
        } else artistSection.innerHTML = "";
      } catch (error) {
        console.log(error);
      }
    }
    async function renderDailyMix() {
      const dailyMixCards = Array.from(document.getElementsByClassName('made-box-card'));
      if(!artistData || artistData.length === 0) return;
      const startIndex = Math.floor(Math.random() * artistData.length);
      for(let i = 0; i < dailyMixCards.length; i++) {
        const currentCard = dailyMixCards[i];
        const artist = artistData[(startIndex + i) % artistData.length];
        if(artist && artist.poster) {
          const poster = artist.poster.trim();
          currentCard.style.backgroundImage = `url('${poster}')`;
          currentCard.style.backgroundRepeat = "no-repeat";
          currentCard.style.backgroundSize = "cover";
        } else {
          console.warn("Missing artist or poster at index", i);
        }
        currentCard.addEventListener('click',
          () => {
            alert('LogIn for personalized daily mix.');
          })
      }
    }

    function searching() {
      const currentInput = document.getElementById('searchbox').value.toLowerCase().trim();
      const defaultBox = document.getElementById('default');
      const artistSection = document.querySelector('.artist-card-section');
      const searchSection = document.getElementById('searchup');
      const mainContent = document.getElementsByClassName('main-content')[0];
      const unavailable = document.getElementsByClassName('unavailable')[0];
      if(!currentInput) {
        document.getElementById('classingList').innerHTML = `<ul id="card-listing-ul"></ul>`;
        defaultBox.style.display = "block";
        searchSection.style.display = "none";
        artistSection.innerHTML = "";
        return;
      }
      let matchingSongList = data.filter(song => song.songName.toLowerCase().startsWith(currentInput));
      if(matchingSongList.length == 0) {
        matchingSongList = data.filter(song => song.songName.toLowerCase().includes(currentInput));
      }
      let matchingArtistList = artistData.filter(artist => artist.name.toLowerCase().startsWith(currentInput));
      if(matchingArtistList.length == 0) {
        matchingArtistList = artistData.filter(artist => artist.name.toLowerCase().includes(currentInput))
      }
      if(matchingSongList.length > 0) {
        defaultBox.style.display = "none";
        mainContent.style.display = "flex";
        unavailable.style.display = "none";
        document.querySelectorAll(".Headings").forEach(el => el.style.display = "flex");
        searchSection.style.display = "flex";
        cardListRendering(matchingSongList);
        const topResult = matchingSongList[0];
        topResultCreateCard(topResult, 0);
        console.log("if");
      } else if(matchingArtistList.length > 0) {
        defaultBox.style.display = "none";
        mainContent.style.display = "flex";
        unavailable.style.display = "none";
        console.log("else if");
      } else {
        defaultBox.style.display = "none";
        searchSection.style.display = 'none';
        unavailable.style.display = 'block';
        document.querySelectorAll(".Headings").forEach(el => el.style.display = "none");
        console.log("else");
      }
      artistCardRendering(matchingArtistList);
    }

    function handleSongClick(index) {
      if(index == currentSongIndex) {
        if(currentSong.paused) {
          alert("The song you choosed is already loaded on your track, control it via player");
        } else {
          alert("The song is playing already");
        }
        return
      }
      if(currentSongLi) {
        currentSongLi.classList.remove("selected-list");
      }
      if(currentSongIndex !== null && !loop) {
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
      console.log("updatedSongAbout");
      updateRecentList(index);
      if(document.getElementsByClassName('song-card').length != 0) {
        let songCardText = document.querySelector('.song-card').children[1].children[0].innerText;
        let currentSongName = (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "");
        console.table([songCardText,
          currentSongName
        ]);
        if(songCardText != currentSongName) {
          document.querySelector('.song-card').classList.remove('selected-card');
        } else {
          document.querySelector('.song-card').classList.add('selected-card');
        }
      }
      if(document.getElementsByClassName('card-list-li').length != 0) {
        let currentSongName = (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "");
        Array.from(document.getElementsByClassName('card-list-li')).forEach((currentSongList) => {
          if(currentSongList.children[0].children[1].children[0].innerText == currentSongName) {
            currentSongList.classList.add("selected-list");
          } else {
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
        <img loading = "lazy" class="svgs1" src="/resources/Posters/${data[index].poster}" alt="">
      </div>
      <div class="content">
        <div class="song-name-poster">${songs[index].replace(".mp3", "")}</div>
        <div class="artist-name-poster">${artistNames[index]}</div>
      </div>
    </div>
  `;
      console.log("updated");
    }

    function updateRecentList(index) {
      if(!recentList.includes(index)) {
        if(recentList.length >= 6) recentList.shift();
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
                <img loading="lazy" src="/resources/Posters/${(data[index].poster)}" alt="">
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
        if(!currentSong.src) return alert("Please Load any song from the playlist before running the track.");
        const isPaused = currentSong.paused;
        const icon = playButton.querySelector("img");
        const currentLi = document.getElementById(currentSongIndex);
        if(isPaused) {
          currentSong.play();
          currentSongLi.classList.add("selected");
          if(document.getElementsByClassName('song-card').length != 0 && document.querySelector('.song-card').children[1].firstElementChild.innerText.toLowerCase() == currentSrc.split('.mp3')[0].toLowerCase()) {
            document.querySelector('.song-card').classList.add("selected-card");
          }
          icon.src = "/resources/SVGS/pause-stroke-rounded.svg";
          currentLi.querySelector(".playbutton img").src = "/resources/SVGS/pause-stroke-rounded.svg";
          currentLi.querySelector(".playbutton img").style.filter = "invert(1)";
          if(document.getElementsByClassName('card-list-li').length != 0) {
            let currentSongName = (currentSong.src.toString()).split("/")[5].replaceAll("%20", " ").replaceAll(".mp3", "");
            Array.from(document.getElementsByClassName('card-list-li')).forEach((currentSongList) => {
              if(currentSongList.children[0].children[1].children[0].innerText == currentSongName) {
                currentSongList.classList.add("selected-list");
              } else {
                currentSongList.classList.remove("selected-list");
              }
            })
          }
        } else {
          currentSong.pause();
          currentSongLi.classList.remove("selected");
          if(document.getElementsByClassName('song-card').length != 0) {
            document.querySelector('.song-card').classList.remove("selected-card");
          }
          icon.src = "/resources/SVGS/play-stroke-rounded.svg";
          currentLi.querySelector(".playbutton").firstElementChild.src = "/resources/SVGS/play-circle-svgrepo-com.svg";
          if(document.getElementsByClassName('card-list-li').length != 0) {
            Array.from(document.getElementsByClassName('card-list-li')).forEach((currentSongList) => {
              currentSongList.classList.remove("selected-list");
            })
          }
        }
      });
    }

    function setupNextButton() {
      let currentSongName = currentSong.src.toString().split('/')[5].replaceAll("%20", " ");
      let currentSongObject = data.filter((eachSongObject) => {
        if(eachSongObject.songName == currentSongName) return eachSongObject
      });
      let index = currentSongObject[0].id == (data.length - 1) ? 0 : currentSongObject[0].id + 1;
      handleSongClick(index);
    }

    function setupPrevButton() {
      let currentSongName = currentSong.src.toString().split('/')[5].replaceAll("%20", " ");
      let currentSongObject = data.filter((eachSongObject) => {
        if(eachSongObject.songName == currentSongName) return eachSongObject
      });
      let index = currentSongObject[0].id == 0 ? (data.length - 1) : currentSongObject[0].id - 1;
      handleSongClick(index);
    }

    function setupLoopToggle() {
      document.querySelector(".loop1").addEventListener("click",
        () => {
          loop = !loop;
          currentSong.loop = loop;
          document.querySelector(".loop1").style.filter = loop ? "contrast(0.0001)" : "invert(1)";
        });
    }

    function setupSeekbar() {
      const seekbar = document.querySelector(".seekbar");
      const rocker = document.getElementById("seek-rocker");
      currentSong.addEventListener("timeupdate", () => {
        if(!currentSong.duration) return;
        const percentage = currentSong.currentTime / currentSong.duration;
        rocker.style.width = `${percentage * 100}%`;
        document.getElementById("current-time").textContent = formatTime(currentSong.currentTime);
        document.getElementById("current-duration").textContent = formatTime(currentSong.duration);
        if(percentage == 1 && !loop) {
          const prevLi = document.getElementById(currentSongIndex);
          prevLi.classList.remove("selected");
          prevLi.querySelector(".playbutton img").src = "/resources/SVGS/play-circle-svgrepo-com.svg";
          document.querySelector('.Play').children[0].src = '/resources/SVGS/play-stroke-rounded.svg';
          rocker.style.width = '0%';
          document.querySelector(".selected-card").classList.remove("selected-card");
          document.getElementById("card-listing-ul").querySelector(".selected-list").classList.remove("selected-list");
        }
      });
      seekbar.addEventListener("click", (e) => {
        const percent = e.offsetX / seekbar.offsetWidth;
        currentSong.currentTime = percent * currentSong.duration;
      });
    }

    function volumeController(e) {
      if(e.target.value == 100) {
        alert("You raised volume too high , risky for your health!!");
      }
      if(e.target.value == 0) {
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
      return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
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
    document.querySelector(".search").addEventListener("click",
      () => {
        document.querySelector(".home-page").style.display = "none";
        document.querySelector(".home").style.color = "#b3b3b3";
        document.querySelector(".search-html").style.display = "block";
        document.querySelector(".search").style.color = "#169b3a";
      })
    document.querySelector(".home").addEventListener("click",
      () => {
        document.querySelector(".home-page").style.display = "block";
        document.querySelector(".home").style.color = "#169b3a";
        document.querySelector(".search-html").style.display = "none";
        document.querySelector(".search").style.color = "#b3b3b3";
      })
    document.getElementById('searchbox').addEventListener('input', () => {
      searching()
    });
    document.getElementById('myRange').addEventListener('input', (e) => {
      volumeController(e)
    });
    document.querySelector('.Next').addEventListener('click',
      () => {
        setupNextButton()
      })
    document.querySelector('.previous').addEventListener('click', () => {
      setupPrevButton()
    })
    init();
  }
  main()
}

function indexFunction() {
  if(window.screen.width < 1024) {
    document.getElementById('desktopFooter').remove();
    mainMobile();
  } else {
    document.getElementById('mobileFooter').remove();
    mainLaptop();
  }
}

indexFunction();