async function logoutClick(){
    var dt = await makeLogoutRequest();
    console.log(dt);
    window.location.replace("index.php");
}

async function makeLogoutRequest(){
    url = "shared/actions/userHandling.php?logout=1";
    const response = await fetch(url);
    const data = await response.text();
    return data;
}

async function deleteAccountClick(){
    var deleteResponse = await makeDeleteAccountRequest();
    console.log(deleteResponse);
    setSession("idUtente", null);
    window.location = "index.php";
}

async function makeDeleteAccountRequest(){
    url = "shared/actions/dataSource.php?deleteAccount=1";
    const response = await fetch(url);
    const data = await response.text();
    return data;
}