var audio = document.querySelector('audio');
const durationIndicator = document.getElementById("durationIndicator");
var seekSlider = document.getElementById('seek-slider');
const currentTimeIndicator = document.getElementById('currentTime');
const playIconContainer = document.getElementById('play-button');
var muteButton = document.getElementById("mute-button");
var shuffleButton = document.getElementById("shuffle-button");
var volumeSlider = document.getElementById("volume-slider");


var isPlaying;
seekSlider.value = 0;
var playerPointer;
var resp;
var muted;
var shuffle = true;

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
    durationIndicator.textContent = calculateTime(audio.duration);
}
const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration);
}

const buttonNext = () => {
    playerPointer++;
    playId(playerPointer);
    audio.pause();
    audio.load();
    audio.play();
    setCookie("playerPointer", playerPointer);
}

const buttonPrev = () => {
    playerPointer--;
    playId(playerPointer);
    audio.pause();
    audio.load();
    audio.play();
    setCookie("playerPointer", playerPointer);
}

audio.addEventListener('ended',function(){
    playerPointer++;
    playId(playerPointer);
    audio.pause();
    audio.load();
    audio.play();
    setCookie("playerPointer", playerPointer);
});

window.addEventListener('load', async function(){
    resp = JSON.parse(await getSession("playlist"));
    var playingSingleTrack = await getSession("playingSingleTrack");
    playingSingleTrack = (playingSingleTrack === "true");
    if(playingSingleTrack){
        setMutedPosition();
        setVolumeSliderPosition();
        setShuffleState();
        var track = (await getSession("track")).replace(/\"/g, "");
        playTrack(track);
        time = getCookie("currentTime");
        audio.currentTime = time;
        seekSlider.value = time;
        setPlayState();
    }
    else{
        if(resp == ""){
            console.log("No playlist on cue");
            muted = true;
            muteButton.innerHTML = '<i class="bi bi-volume-mute-fill h4"></i>';
            audio.muted = true;
        }
        else{
            setMutedPosition();
            setVolumeSliderPosition();
            setShuffleState();
            console.log(resp);
            playerPointer = getCookie("playerPointer");
            if(playerPointer == ""){playerPointer = 0;}
            console.log(playerPointer);
            playId(playerPointer);
            time = getCookie("currentTime");
            audio.load();
            audio.currentTime = time;
            seekSlider.value = time;
            setPlayState();
        }
    }
})

function playId(id){
    var trackObj = resp[id];
    console.log(trackObj);
    audioPath = trackObj["percorsoFile"];
    coverLink = trackObj["coverImage"];
    audio = document.querySelector("audio");
    var coverContainer = document.getElementById("coverContainer");
    var nameContainer = document.getElementById("trackNameContainer");
    var artistContainer = document.getElementById("artistNameContainer");
    nameContainer.innerText = capitalizeFirstLetter(trackObj.titolo);
    artistContainer.innerText = trackObj.nome;
    coverContainer.src = coverLink;
    audio.src = "../" + audioPath;
}

muteButton.addEventListener('click', () => {
    muted = !muted;
    if(!muted){
        muted = false;
        muteButton.innerHTML = '<i class="bi bi-volume-up-fill h4"></i>';
        audio.muted = false;
        setSession("muted", false);
    }
    else{
        muted = true;
        muteButton.innerHTML = '<i class="bi bi-volume-mute-fill h4"></i>';
        audio.muted = true;
        setSession("muted", true);
    }
});

shuffleButton.addEventListener('click', async () => {
    if(shuffle){
        shuffle = false;
        shuffleButton.innerHTML = '<i class="bi bi-arrow-right h4"></i>';
        await setShuffle(false);
    }
    else{
        shuffle = true;
        shuffleButton.innerHTML = '<i class="bi bi-shuffle h4"></i>';
        setShuffle(true);
    }
    playPlaylist();
});

async function setShuffleState(){
    shuffle = await getSession("shuffled");
    shuffle = (shuffle === "true");
    if(shuffle){
        shuffleButton.innerHTML = '<i class="bi bi-shuffle h4"></i>';
    }else{
        shuffleButton.innerHTML = '<i class="bi bi-arrow-right h4"></i>';
    }
}

async function setShuffle(willShuffle){
    var isShuffle = getSession("shuffled");
    if(isShuffle == willShuffle){
        return 0;
    }else{
        if(willShuffle){
            shuffleArray(resp);
            setSession("playlist", resp);
            setSession("shuffled", true);
        }else{
            plId = resp[0]["playlistId"];
            resp = await makeGetPlaylistRequest("shared/actions/dataSource.php?getPlaylistTracks=1", plId);
            setSession("playlist", resp);
            setSession("shuffled", false);
        }
    }
}

async function makeGetPlaylistRequest(url, param){
    urlFull = url + '&playlistId=' + param;
    const response = await fetch(urlFull);
    const data = await response.json();
    return data;
}

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    setSession("volume", volumeSlider.value);
});

async function setVolumeSliderPosition(){
    var vol = (await getSession("volume")).replace(/\"/g, "");
    vol = parseFloat(vol);
    volumeSlider.value = vol;
    audio.volume = vol;
}

async function setPlayState(){
    isPlaying = await getSession("playing");
    isPlaying = (isPlaying === "true");
    if(isPlaying){
        playIconContainer.innerHTML = '<i class="fas fa-pause fa-lg"></i>';
        audio.play();
    }else{
        playIconContainer.innerHTML = '<i class="fas fa-play fa-lg"></i>';
        audio.pause();
    }
}

async function setMutedPosition(){
    muted = await getSession("muted");
    muted = (muted === "true");
    if(muted){
        muteButton.innerHTML = '<i class="bi bi-volume-mute-fill h4"></i>';
        audio.muted = true;
    }else{
        muteButton.innerHTML = '<i class="bi bi-volume-up-fill h4"></i>';
        audio.muted = false;
    }
}

seekSlider.addEventListener('input', () => {
    currentTimeIndicator.textContent = calculateTime(seekSlider.value);
});
seekSlider.addEventListener('change', () => {
    audio.currentTime = seekSlider.value;
});

audio.addEventListener('timeupdate', () => {
    seekSlider.value = Math.floor(audio.currentTime);
    currentTimeIndicator.textContent = calculateTime(seekSlider.value);
    setCookie("currentTime", audio.currentTime);
});

const playClick = () => {
    if(isPlaying) {
        audio.pause();
        isPlaying = false;
        playIconContainer.innerHTML = '<i class="fas fa-play fa-lg"></i>';
        setSession("playing", false);
    } else {
        audio.play();
        isPlaying = true;
        playIconContainer.innerHTML = '<i class="fas fa-pause fa-lg"></i>';
        setSession("playing", true);
    }
}

playIconContainer.addEventListener('click', playClick);

audio.addEventListener('loadedmetadata', () => {
    displayDuration();
    setSliderMax();
    seekSlider.value = 0;
});

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(name,value) {
    document.cookie = name + "=" + (value || "");
}
async function getSession(key){
    var r = await makeGetSessionRequest(key);
    return r;
}

async function makeGetSessionRequest(key){
    urlFull = 'shared/actions/sessionManagement.php?getSession=1&key=' + key;
    const response = await fetch(urlFull);
    const data = await response.text();
    return data;
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function shuffleArray(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
  
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

async function setSession(key, value){
    var r = await makeSetSessionRequest(key, value);
}

async function makeSetSessionRequest(key, value){
    url = 'shared/actions/sessionManagement.php';
    const response = await fetch(url,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({"setSession": 1, "key": key, "value": value})
        })
    const data = await response.text();
    return data;
}

function playPlaylist(){
    playerPointer = 0;
    setCookie("playerPointer", playerPointer);
    var trackObj = resp[0];
    audio.src = "../" + trackObj.percorsoFile;
    coverLink = trackObj["coverImage"];
    var coverContainer = document.getElementById("coverContainer");
    var nameContainer = document.getElementById("trackNameContainer");
    var artistContainer = document.getElementById("artistNameContainer");
    nameContainer.innerText = capitalizeFirstLetter(trackObj.titolo);
    artistContainer.innerText = trackObj.nome;
    coverContainer.src = coverLink;

    audio.play();
}

function playTrack(element){
    var track = decodeURIComponent(element);
    var trackObj = JSON.parse(track);
    audioPath = trackObj["percorsoFile"];
    coverLink = trackObj["coverImage"];
    audio = document.querySelector("audio");
    var coverContainer = document.getElementById("coverContainer");
    var nameContainer = document.getElementById("trackNameContainer");
    var artistContainer = document.getElementById("artistNameContainer");
    nameContainer.innerText = trackObj.titolo;
    artistContainer.innerText = trackObj.nome;
    coverContainer.src = coverLink;
    audio.src = "../" + audioPath;
    playState="play";
    if(!isPlaying){playClick()}
    setSession("playingSingleTrack", true);
    setSession("track", element);
    audio.play();
}