const wrapper = document.querySelector(".wrapper"),
songImg = wrapper.querySelector(".image img"),
songName = wrapper.querySelector(".song .name"),
songArtist = wrapper.querySelector(".song .artist"),
mainAudio = wrapper.querySelector("#mainaudio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progress = wrapper.querySelector(".progress");
repeatBtn = wrapper.querySelector("#repeat");
musicList = wrapper.querySelector(".musiclist"),
moreMusicBtn = wrapper.querySelector("#moremusic"),
closeBtn = musicList.querySelector("#close");

let musicIndex=1;

window.addEventListener("load", ()=>{
    loadmusic(musicIndex);
    playingNow();
});

function loadmusic(index){
    songName.innerText=allSongs[index-1].name;
    songArtist.innerText=allSongs[index-1].artist;
    songImg.src=`images/${allSongs[index-1].img}.jpg`;
    mainAudio.src=`songs/${allSongs[index-1].src}.mp3`;
}

function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
}

function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
}

playPauseBtn.addEventListener("click", ()=>{
    const isMusicPlay = wrapper.classList.contains("paused");
    isMusicPlay ? pauseMusic() : playMusic();
    playingNow();
  });

function prevMusic(){
    musicIndex--; 
    musicIndex < 1 ? musicIndex = allSongs.length: musicIndex = musicIndex;
    loadmusic(musicIndex);
    playMusic();
    playingNow();
}

function nextMusic(){
    musicIndex++; 
    musicIndex > allSongs.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadmusic(musicIndex);
    playMusic();
    playingNow();
}

nextBtn.addEventListener("click", ()=>{
    nextMusic();
});

prevBtn.addEventListener("click", ()=>{
    prevMusic();
});

mainAudio.addEventListener("timeupdate",(e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    if(duration>0){
    let progressWidth = (currentTime/duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    }
    let songCurrentTime = wrapper.querySelector(".current-time");
    let songDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata",()=>{
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration/60);
        let totalSec = Math.floor(audioDuration%60);
        if(totalSec<10){
            totalSec=`0${totalSec}`;
        }
        songDuration.innerText = `${totalMin}:${totalSec}`;
    });

    let currentMin = Math.floor(currentTime/60);
    let currentSec = Math.floor(currentTime%60);
    if(currentSec<10){
        currentSec=`0${currentSec}`;
    }
    songCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progress.addEventListener("click", (e)=>{
    let progressWidth = progress.clientWidth; 
    let clickedOffsetX = e.offsetX; 
    let songDuration = mainAudio.duration; 
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
    playingNow();
});

repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText;
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

mainAudio.addEventListener("ended", ()=>{
    let getText = repeatBtn.innerText; 
    switch(getText){
      case "repeat":
        nextMusic(); 
        break;
      case "repeat_one":
        mainAudio.currentTime = 0; 
        loadmusic(musicIndex); 
        playMusic();
        break;
      case "shuffle":
        let randIndex = Math.floor((Math.random() * allSongs.length)); 
        do{
          randIndex = Math.floor((Math.random() * allSongs.length));
        }while(musicIndex == randIndex); 
        musicIndex = randIndex;
        loadmusic(musicIndex);
        playMusic();
        playingNow();
        break;
    }
});

moreMusicBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

closeBtn.addEventListener("click", ()=>{
    musicList.classList.remove("show");
});

const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allSongs.length; i++) {
  let liTag = `<li li-index="${i+1}">
                <div class="row">
                  <span>${allSongs[i].name}</span>
                  <p>${allSongs[i].artist}</p>
                </div>
                <span id="${allSongs[i].src}" class="duration">7:52</span>
                <audio class="${allSongs[i].src}" src="songs/${allSongs[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); 

  let liAudioDuartionTag = ulTag.querySelector(`#${allSongs[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allSongs[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`;
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
}); 
}
  
function playingNow(){
    const allLiTag = ulTag.querySelectorAll("li");
    for (let j = 0; j < allLiTag.length; j++) {
      let audioTag = allLiTag[j].querySelector(".duration");
      if(allLiTag[j].classList.contains("playing")){
        allLiTag[j].classList.remove("playing");
        audioTag.innerText = audioTag.getAttribute("t-duration");;
      }
      if(allLiTag[j].getAttribute("li-index") == musicIndex){
        allLiTag[j].classList.add("playing");
        audioTag.innerText = "Playing";
      }
      allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
  }

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; 
    loadmusic(musicIndex);
    playMusic();
    playingNow();
  }