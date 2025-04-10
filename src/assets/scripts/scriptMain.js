window.addEventListener('load', () => {
    var mode = localStorage.getItem("mode");
    if(mode == "dark-mode"){
        document.body.classList.remove("light-mode");
    }
    else{
        document.body.classList.add("light-mode");
    }
    setSession("mode", mode);
});

async function toggleLightModeClick(){
    document.body.classList.toggle("light-mode");
    var currentMode = (await getSessionText("mode")).replace(/\"/g, "");
    if(currentMode == "dark-mode"){
        setSession("mode", "light-mode");
        localStorage.setItem("mode", "light-mode");
    }
    else{
        setSession("mode", "dark-mode");
        localStorage.setItem("mode", "dark-mode");
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

async function getSessionText(key){
    var r = await makeGetSessionTextRequest(key);
    return r;
}

async function makeGetSessionTextRequest(key){
    urlFull = 'shared/actions/sessionManagement.php?getSession=1&key=' + key;
    const response = await fetch(urlFull);
    const data = await response.text();
    return data;
}
