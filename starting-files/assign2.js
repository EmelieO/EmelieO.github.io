
/* url of song api --- https versions hopefully a little later this semester */	
const api = "https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";

 
/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/

if (localStorage.getItem("genres") === null || localStorage.getItem("artists") === null || localStorage.getItem("songsData") === null) {
   const genreList = [];
   const artistList = [];
   const songList = [];

   const response = await fetch(api);
   const data = await response.json();
   const songtp = JSON.stringify(data);
   const allSongs = JSON.parse(songtp);

   for (let i = 0; i < allSongs.length; i++) {
      const temporgenre = allSongs[i]["genre"];
      genreList.push(temporgenre);
   }

   for (let i = 0; i < allSongs.length; i++) {
      const temporartist = allSongs[i]["artist"];
      artistList.push(temporartist);
   }

   for (let i = 0; i < allSongs.length; i++) {
      const temporsong = allSongs[i];
      songList.push(temporsong);
   }

   const genres = genreList;
   const tempartist = JSON.stringify(artistList);
   const artists = JSON.parse(tempartist);
   const tempsong = JSON.stringify(songList);
   const songsData = JSON.parse(tempsong);

   localStorage.setItem("genres", JSON.stringify(genres));
   localStorage.setItem("artists", JSON.stringify(artists));
   localStorage.setItem("songsData", JSON.stringify(songsData));

} else {
}

const genres = JSON.parse(localStorage.getItem("genres"));
const artists = JSON.parse(localStorage.getItem("artists"));
const songsData = JSON.parse(localStorage.getItem("songsData"));

const songsArray = [];

if (localStorage.getItem("playlist") === null) {
   const playlist = [];
   localStorage.setItem("playlist", JSON.stringify(playlist));
}

const getOneArtist = function (artists) {

   const oneArtist = [...new Set(artists.map((item) => item.name))];

   const artistIDs = [];
   oneArtist.map((artist) => {
       const artistID = artists.find((item) => item.name === artist).id;
      artistIDs.push(artistID);
   });

   const artistNamesAndIDs = [];

   for (let i = 0; i < oneArtist.length; i++) {
      artistNamesAndIDs.push({
      name: oneArtist[i], id: artistIDs[i],
   });
 }

 return artistNamesAndIDs;

};

const oneArtist = getOneArtist(artists);

for (let a of oneArtist) {
   let option = document.createElement("option");
   option.text = a["name"];
   option.value = a["id"];
   let aSelect = document.getElementById("artist");
   aSelect.appendChild(option);
}

const getOneGenres = function (genres) {

   const oneGenres = [...new Set(genres.map((item) => item.name))];

   const genreIDs = [];
   oneGenres.map((genre) => {
      const genreID = genres.find((item) => item.name === genre).id;
      genreIDs.push(genreID);
   });

   const genreNamesAndIDs = [];

   for (let i = 0; i < oneGenres.length; i++) {
      genreNamesAndIDs.push({
      name: oneGenres[i], id: genreIDs[i],
   });
 }

 return genreNamesAndIDs;

};

const oneGenres = getOneGenres(genres);

for (let g of oneGenres) {
   let option = document.createElement("option");
   option.text = g["name"];
   option.value = g["id"];
   let aSelect = document.getElementById("genre");
   aSelect.appendChild(option);
}

const tableBody = document.getElementById("tBody");

for (let s of songsData) {
   const songSec = document.createElement("tr");
   songSec.setAttribute("songID", s["song_id"]);

   const infoSongTit = document.createElement("td");
   infoSongTit.textContent = s["title"];
   infoSongTit.style.cursor = "pointer";
   songSec.insertAdjacentElement("beforeend", infoSongTit);
   tableBody.insertAdjacentElement("afterend", songSec);

   const infoSongArt = document.createElement("td");
   infoSongArt.textContent = s["artist"]["name"];
   songSec.appendChild(infoSongArt);

   const infoSongYear = document.createElement("td");
   infoSongYear.textContent = s["year"];
   songSec.appendChild(infoSongYear);

   const infoSongGenre = document.createElement("td");
   infoSongGenre.textContent = s["genre"]["name"];
   songSec.appendChild(infoSongGenre);

   const infoSongPop = document.createElement("td");
   infoSongPop.textContent = s["details"]["popularity"];
   songSec.appendChild(infoSongPop);

   const playlistButton = document.createElement("button");
   playlistButton.textContent = "Add";
   playlistButton.setAttribute("class", "add-to-playlist");
   playlistButton.setAttribute("songID", s["song_id"]);
   songSec.appendChild(playlistButton);
   tableBody.appendChild(songSec);

   const mySongs = new Song(s);
   songsArray.push(mySongs);

}

const tableContent = document.getElementById("tBody");
const tableButtons = document.querySelectorAll("th ");

const createRow = (obj, adtn) => {
   const row = document.createElement("tr");
   const objectKeys = Object.keys(obj);

   objectKeys.map((key) => {
      const space = document.createElement("td");
      space.setAttribute("data-attr", key);
      space.innerHTML = obj[key];
      space.style.cursor = "pointer";
      row.appendChild(space);
   });

   const songID = songsArray.find((song) => {
         return song.title === obj.title;
   });

   const playlistButton = document.createElement("button");
   playlistButton.textContent = "Add";
   playlistButton.classList.add("add-to-playlist");
   row.appendChild(playlistButton);
   playlistButton.setAttribute("songID", songID.songID);
   row.setAttribute("songid", songID.songID);

   return row;

};

const getContent = (data) => {
   const pData = [];

   data.map((item) => {
      const obj = {
         title: item.title,
         artist: item.artist.name,
         year: item.year,
         genre: item.genre,
         popularity: item.popularity,
      };

      pData.push(obj);

   });

   pData.map((obj, adtn) => {
      const row = createRow(obj);
      tableContent.appendChild(row);
   });

   addPopul();
   showSongDetails();
   songToPlaylistSec();

};

const getContentFiltered = (data) => {
   const pData = [];

   data.map((item) => {

       const obj = {
       title: item.title,
       artist: item.artist.name,
       year: item.year,
       genre: item.genre,
       popularity: item.popularity,
       };

       pData.push(obj);

   });

   pData.map((obj) => {
      const row = createRow(obj);
      tableContent.appendChild(row);
   });

   addPopul();
   showSongDetails();
   songToPlaylistSec();

};

const sortByTitle = (data, direction = "asc") => {
   tableContent.innerHTML = "";

   const toSort = [...data].sort((a, b) => {
       if (a.title.toUpperCase() < b.title.toUpperCase()) {
       return -1;
       }
       if (a.title.toUpperCase() > b.title.toUpperCase()) {
       return 1;
       }
       return 0;

   });

   if (direction === "desc") {
       toSort.reverse();
   }

   getContent(toSort);

};

const sortByArtist = (data, direction = "asc") => {
   tableContent.innerHTML = "";

   const toSort = data.sort((a, b) => {
       if (a.artist.name.toUpperCase() < b.artist.name.toUpperCase()) {
           return -1;
       }

       if (a.artist.name.toUpperCase() > b.artist.name.toUpperCase()) {
           return 1;
       }

       return 0;

   });

   if (direction === "desc") {
      toSort.reverse();
   }

   getContent(toSort);

};

const sortByYear = (data, direction) => {
   tableContent.innerHTML = "";
   const toSort = data.sort((a, b) => {

       if (a.year < b.year) {
           return -1;
       }

       if (a.year > b.year) {
           return 1;
       }
       return 0;

   });

   if (direction === "desc") {
      toSort.reverse();
   }

   getContent(toSort);

};

const sortByGenre = (data, direction) => {
   tableContent.innerHTML = "";
   const toSort = data.sort((a, b) => {

       if (a.genre< b.genre) {
           return -1;
       }
       if (a.genre > b.genre) {
           return 1;
       }
       return 0;

   });

   if (direction === "desc") {
      toSort.reverse();
   }

   getContent(toSort);

};

const sortByPopularity = (data, direction = "asc") => {
 tableContent.innerHTML = "";
 const toSort = [...data].sort((a, b) => {

   if (a.popularity< b.popularity) {
       return -1;
   }
   if (a.popularity > b.popularity) {
       return 1;
   }
   return 0;

 });

 if (direction === "desc") {
   toSort.reverse();
 }

 getContent(toSort);

};

function Song(s) {
   this.title = s["title"];
   this.artist = s["artist"];
   this.year = s["year"];
   this.genre = s["genre"]["name"];
   this.popularity = s["details"]["popularity"];
   this.songID = s["song_id"];

}

tableButtons[0].addEventListener("click", () => {
   const title = document.getElementById("title");
   title.setAttribute("data-dir", "asc");
   const direction = tableButtons[0].getAttribute("data-dir");

   if (direction === "asc") {
       sortByTitle(songsArray, "desc");
       tableButtons[0].setAttribute("data-dir", "desc");
       tableButtons[0].innerHTML = "Title &#9660;";
   } else {
       sortByTitle(songsArray, "asc");
       tableButtons[0].setAttribute("data-dir", "asc");
       tableButtons[0].innerHTML = "Title &#9650;";
   }

});

tableButtons[1].addEventListener("click", () => {
   const artist = document.getElementById("artist");
   artist.setAttribute("data-dir", "asc");
   const direction = tableButtons[1].getAttribute("data-dir");

   if (direction === "asc") {
       sortByArtist(songsArray, "desc");
       tableButtons[1].setAttribute("data-dir", "desc");
       tableButtons[1].innerHTML = "Artist &#9660;";
   } else {
       sortByArtist(songsArray, "asc");
       tableButtons[1].setAttribute("data-dir", "asc");
       tableButtons[1].innerHTML = "Artist &#9650;";
   }

});

tableButtons[2].addEventListener("click", () => {
   const direction = tableButtons[2].getAttribute("data-dir");

   if (direction === "asc") {
       sortByYear(songsArray, "desc");
       tableButtons[2].setAttribute("data-dir", "desc");
       tableButtons[2].innerHTML = "Year &#9660;";
   } else {
       sortByYear(songsArray, "asc");
       tableButtons[2].setAttribute("data-dir", "asc");
       tableButtons[2].innerHTML = "Year &#9650;";
   }

});

tableButtons[3].addEventListener("click", () => {
   const genre = document.getElementById("genre");
   genre.setAttribute("data-dir", "asc");
   const direction = tableButtons[3].getAttribute("data-dir");

   if (direction === "asc") {
       sortByGenre(songsArray, "asc");
       tableButtons[3].setAttribute("data-dir", "desc");
       tableButtons[3].innerHTML = "Genre &#9660;";
   } else {
       sortByGenre(songsArray, "desc");
       tableButtons[3].setAttribute("data-dir", "asc");
       tableButtons[3].innerHTML = "Genre &#9650;";
   }

});

tableButtons[4].addEventListener("click", () => {
   const direction = tableButtons[4].getAttribute("data-dir");

   if (direction === "asc") {
       sortByPopularity(songsArray, "desc");
       tableButtons[4].setAttribute("data-dir", "desc");
       tableButtons[4].innerHTML = "Popularity &#9660;";
   } else {
       sortByPopularity(songsArray, "asc");
       tableButtons[4].setAttribute("data-dir", "asc");
       tableButtons[4].innerHTML = "Popularity &#9650;";
   }

});

tableButtons.forEach((button) => {
   button.addEventListener("mouseover", () => {
       button.style.cursor = "pointer";
   });

});

const addPopul = function () {
   const popularity = document.querySelectorAll("td:nth-child(5)");
   popularity.forEach((pop) => {
       pop.classList.add("popularity");
   });

};

addPopul();

const formFilt = function () {
   const filterHeader = document.getElementsByClassName("th-header");
   filterHeader[0].innerHTML = "Browse Songs";
   const form = document.getElementById("filterBox");
   
   form.addEventListener("submit", (event) => {
       event.preventDefault();
       const filterT = document.getElementById("filterT");
       const filterA = document.getElementById("filterA");
       const filterG = document.getElementById("filterG");

      if (filterT.checked) {
         const filterTerm = document.getElementById("title").value;
         tableContent.innerHTML = "";

         const toSort = songsArray.filter((song) => {
            return song.title.toLowerCase().includes(filterTerm.toLowerCase());
         });

         if (toSort) {
            getContentFiltered(toSort);
         } else {
            tableContent.innerHTML = "No results found";
         }

      }

       if (filterA.checked) {
           const filterTermA = document.getElementById("artist").value;
           tableContent.innerHTML = "";
           const sortedA = songsArray.filter((song) => {
               return song.artist["id"] == filterTermA;
           });

           if (sortedA) {
               getContent(sortedA);
           } else {
               tableContent.innerHTML = "No results found";
           }
       }

       if (filterG.checked) {
           const filterTermG = document.getElementById("genre").value;
           const genreName = genres.find((genre) => genre.id == filterTermG);

           tableContent.innerHTML = "";

           const sortedG = songsArray.filter((song) => {
               return song.genre == genreName["name"];
           });

           if (sortedG) {
               getContent(sortedG);
           } else {
               tableContent.innerHTML = "No results found";
           }

   }

 });

};

formFilt();

const displaySongDetails = function (song) {
   const tableHeader = document.getElementById("headerRow");
   const closeView = document.getElementById("closeView");

   closeView.style.display = "block";
   tableHeader.style.display = "none";

   const raw_sondid = song.songID;
   const newSong = songsData.find((song) => song.song_id === raw_sondid);

   tableContent.innerHTML = "";
   
   const duration = newSong.details.duration;
   const minutes = Math.floor(duration / 60);
   const seconds = duration % 60;
   const durationString = `${minutes}:${seconds}`;

   var data = [
       { x: "Danceability", value: newSong.analytics.danceability },
       { x: "energy", value: newSong.analytics.energy },
       { x: "Speechiness", value: newSong.analytics.speechiness },
       { x: "Acousticness", value: newSong.analytics.acousticness },
       { x: "Liveness", value: newSong.analytics.liveness },
       { x: "Valence", value: newSong.analytics.valence },
   ];

   var chart = anychart.radar();

   chart.yScale().minimum(-15).maximum(100).ticks({ interval: 5 });

   chart.line(data);

   chart.title("Radar Chart");

   tableContent.innerHTML = `

   <div class="songDetails">

               <div class="song-info">

                   <h3>Song information</h3>

                   <h4 id="songTitle"> - Song Title: ${song.title}</h4>

                   <h5 id="songArtist"> - Artist: ${song.artist.name}</h5>

                   <h5 id="songGenre"> - Genre: ${song.genre}</h5>

                   <h5 id="songYear"> - Year: ${song.year}</h5>

                   <h5 id="songDuration"> - Duration: ${durationString} Minutes</h5>

                   <h4>Analysis data</h4>

                   <h5 id="bpm"> - BPM: <b>${newSong.details.bpm}</b></h5>

                   <h5 id="songEnergy"> - Energy: ${newSong.analytics.energy}</h5>

                   <h5 id="songLoudness"> - Loudness: ${newSong.details.loudness}</h5>

                   <h5 id="songDanceability"> - Danceability: ${newSong.analytics.danceability}</h5>

                   <h5 id="songLiveness"> - Liveness: ${newSong.analytics.liveness}</h5>

                   <h5 id="songValence"> - Valence: ${newSong.analytics.valence}</h5>

                   <h5 id="songAcousticness"> - Acousticness: ${newSong.analytics.acousticness}</h5>

                   <h5 id="songSpeechiness"> - Speechiness: ${newSong.analytics.speechiness}</h5>

                   <h5 id="songPopularity"> - Popularity: ${newSong.details.popularity}</h5>

               </div>

               <div class="song-radar">

                   <h2>Radar chart</h2>

                   <div class="chart" id="chart">
                   </div>

               </div>

   </div>

   `;

   chart.container("chart");
   chart.draw();

};

const showSongDetails = function () {
   const tableRow = document.querySelectorAll("tr");

   tableRow.forEach((row, index) => {
       if (index > 0) {
           const firstTd = row.firstElementChild;

           firstTd.addEventListener("click", (event) => {
               const songId = row.getAttribute("songId");

               const song = songsArray.find((song) => {
                   return song.songID == songId;
               });

               displaySongDetails(song);
           });
       }
   });
};

const addToPlaylist = function (song) {
   const playlist = JSON.parse(localStorage.getItem("playlist"));
   const songInPlaylist = playlist.find((playlistSong) => {
       return playlistSong.song_id == song.song_id;
   });

   if (!songInPlaylist) {
       playlist.push(song);
       localStorage.setItem("playlist", JSON.stringify(playlist));

   }
};

const songToPlaylistSec = function () {
   const addToPlaylistBtn = document.querySelectorAll(".add-to-playlist");
   addToPlaylistBtn.forEach((btn, index) => {

       btn.addEventListener("click", () => {
           const songId = btn.getAttribute("songid");
           const song = songsData.find((song) => {
           return song.song_id == songId;
       });

       addToPlaylist(song);

       });
   });
};

const displayPlaylist = function () {
   const closeView = document.getElementById("closeView");

   closeView.style.display = "block";

   tableContent.innerHTML = "";

   const playlist = JSON.parse(localStorage.getItem("playlist"));

   if (playlist.length == 0) {
       tableContent.innerHTML = "Playlist is empty";

   } else {

       const clearPlaylistBtn = document.getElementsByClassName("clear-playlist");

       if (clearPlaylistBtn.length == 0) {
           const clearPlaylistBtn = document.createElement("button");
           clearPlaylistBtn.innerHTML = "Clear Playlist";
           clearPlaylistBtn.classList.add("clear-playlist");
           clearPlaylistBtn.style.backgroundColor = "red";
           clearPlaylistBtn.style.color = "white";
           clearPlaylistBtn.classList.add("custom-btn");
           clearPlaylistBtn.addEventListener("click", () => {

           localStorage.removeItem("playlist");

           location.reload();
       });

       const nav = document.querySelector(".nav");
       nav.appendChild(clearPlaylistBtn);

       }

       const numberOfSongs = playlist.length;

       const averagePopularityRaw = playlist.reduce((total, song) => {
           return total + song.details.popularity;
       }, 0);

       const averagePopularity = Math.round(averagePopularityRaw / numberOfSongs);

       const playlistSummary = document.querySelector(".playlistSummary");
       playlistSummary.style.display = "block";

       const playSongs = document.getElementById("playSongs");
       playSongs.innerHTML = numberOfSongs;

       const playPopularity = document.getElementById("playPopularity");
       playPopularity.innerHTML = averagePopularity;

       getContentPlaylist(playlist);
   }

};

const playlistBtn = document.getElementById("playlist");

playlistBtn.addEventListener("click", () => {
   displayPlaylist();
});

const getContentPlaylist = (data) => {
   const tableHeader = document.getElementById("add");

   tableHeader.innerHTML = `Remove from playlist`;

   const pData = [];

   data.map((item) => {
       const obj = {
           title: item.title,
           artist: item.artist.name,
           year: item.year,
           genre: item.genre.name,
           popularity: item.details.popularity,
       };

       pData.push(obj);

   });

   pData.map((obj) => {
       const row = createRowPlaylist(obj);
       tableContent.appendChild(row);
   });

   addPopul();

   showSongDetails();

};

const createRowPlaylist = (obj) => {
   const row = document.createElement("tr");
   const objectKeys = Object.keys(obj);

   objectKeys.map((key) => {
       const space = document.createElement("td");
       space.setAttribute("data-attr", key);
       space.innerHTML = obj[key];
       space.style.cursor = "pointer";
       row.appendChild(space);
   });

   const song_id = songsArray.find((song) => {
       return song.title === obj.title;
   });

   const playlistButton = document.createElement("button");

   playlistButton.textContent = "Remove";
   playlistButton.classList.add("remove-from-playlist");
   playlistButton.setAttribute("songid", song_id.songID);

   row.appendChild(playlistButton);
   row.setAttribute("songid", song_id.songID);

   playlistButton.addEventListener("click", () => {
       removeFromPlaylist(song_id);
   });

   return row;

};

const removeFromlistListenner = function () {

   const removeFromPlaylistBtn = document.querySelectorAll(".remove-from-playlist");

   removeFromPlaylistBtn.forEach((btn, index) => {

       btn.addEventListener("click", () => {
           const songId = btn.getAttribute("songid");
           const song = songsData.find((song) => {

           return song.song_id == songId;

       });

       removeFromPlaylist(song);

       });
   });
};

const removeFromPlaylist = function (song) {

   const playlist = JSON.parse(localStorage.getItem("playlist"));
   const songInPlaylist = playlist.find((playlistSong) => {

       return playlistSong.song_id == song.songID;

   });

   if (songInPlaylist) {
      for (let i = 0; i < playlist.length; i++) {
         if (playlist[i].song_id == song.songID) {
             playlist.splice(i, 1);
             localStorage.setItem("playlist", JSON.stringify(playlist));
         }
     }
   }

   displayPlaylist();

};

document.addEventListener("DOMContentLoaded", () => {
   addPopul();
   showSongDetails();
   songToPlaylistSec();
   removeFromlistListenner();

   const creditShow = document.querySelector(".crdtshw");
   const creditContent = document.querySelector(".cont");

   creditShow.addEventListener("mouseover", () => {
       creditContent.style.display = "block";
       setTimeout(() => {
           creditContent.style.display = "none";
       }, 4000);

   });

   const closeView = document.getElementById("closeView");

   closeView.addEventListener("click", () => {
       window.location.href = "index.html";
   });
});

// async function getapi(api) {
//    const genreList = [];
//    const artistList = [];
//    const songList = [];

//    const response = await fetch(api);
//    const data = await response.json();
//    const songtp = JSON.stringify(data);

//    const allSongs = JSON.parse(songtp);

//    for (let i = 0; i < allSongs.length; i++) {
//       const temporgenre = allSongs[i]["genre"];
//       genreList.push(temporgenre);
//    }

//    for (let i = 0; i < allSongs.length; i++) {
//       const temporartist = allSongs[i]["artist"];
//       artistList.push(temporartist);
//    }

//    for (let i = 0; i < allSongs.length; i++) {
//          const temporsong = allSongs[i];
//          songList.push(temporsong);
//    }

//    return [ genreList, artistList, songList ];

// }

// export { getapi, api };