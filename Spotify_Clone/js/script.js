 console.log("Let's write javaScript");
 let currentsong = new Audio();
 let song;
 let currFolder;
//  Function for timestamp shows in seekbar
function secondToMinutesSeconds(second){
   if(NaN(second) || second<0){
      return "00:00";
   }
   const minutes = Math.floor(second/60);
   const remainigSecond  = Math.floor(second%60);
   const formattedMinutes = String(minutes).padStart(2, '0');
   const formetedSecond = String(remainigSecond).padStart(2, '0');
   return `${formattedMinutes}:${formetedSecond}`;

}

// async function to get song from  the folder
async function getSongs(folder) {
   currFolder = folder;
   let a = await fetch(`/${folder}/`)
   let response = await a.text();
   let div = document.createElement("div")
   div.innerHTML = response;
   let as = div.getElementsByTagName("a")
   songs = []
   for (let index = 0; index < as.length; index++) {
       const element = as[index];
       if (element.href.endsWith(".mp3")) {
           songs.push(element.href.split(`/${folder}/`)[1])
       }
   }



   // Show all the songs in the playlist
   let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
   songUL.innerHTML = ""
   for (const song of songs) {
       songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt="">
                           <div class="info">
                               <div> ${song.replaceAll("%20", " ")}</div>
                               <div>Harry</div>
                           </div>
                           <div class="playnow">
                               <span>Play Now</span>
                               <img class="invert" src="img/play.svg" alt="">
                           </div> </li>`;
   }

   // Attach an event listener to each song
   Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
       e.addEventListener("click", element => {
           playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

       })
   })

   return songs
}

const playmusic = (track, pause = false)=>{
    currentsong.src = `/&{currentFolder}/` + track
    if(!pause){
        currentsong.play( )
        play.src = "img/pause.svg"

    }
    document.querySelector(".songInfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML= "00:00/00:00"
}

async function displayAlbums( ) {
    console.log("display albums")
    let a = await fetch(`/songs`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for(let index = 0; index<array.length; index++){
        const e =array[index];
        if(e.href.includes("/songs")&& !e.href.includes("htaccess")){
            let folder = e.href.split("/").slice(-2)[0]
            //get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
        //Load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => { 
            e.addEventListener("click", async item => {
                console.log("Fetching Songs")
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
                playMusic(songs[0])
    
            })
        })
    
    }
}
async function main( ) {
    //get the list of all the songs
    await getSongs("songs/ncs");
    playmusic(songs[0], true)
    //Display all the albums on the page
    await displayAlbums()
    //Attach an event listener to play, next and previous
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "img/pause.svg" 
            }else{
                currentsong.pause()
                play.src = "img/play.svg"
        }
    })
    //Listen for timeupdate event
    currentsong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondToMinutesSeconds(currentsong.currentTime)}/${secondToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";

    })
    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX /e.target.getBoudingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100;

    })
    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })
    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="-120%";

    })
    //Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
}