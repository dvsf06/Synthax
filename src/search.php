<?php
    session_start();
    if(!isset($_SESSION["mode"])){
        $_SESSION["mode"] = "dark-mode";
    }
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cerca</title>
    <link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">

    <link rel="stylesheet" href="assets/playerStyle.css">
    <link rel="stylesheet" href="assets/styleSearch.css">
    <link rel="stylesheet" href="assets/styleMain.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body style="padding-bottom: 30vh" class="<?php echo $_SESSION["mode"]; ?>">
    <?php include 'shared/navbarSimplified.php'?>
    <div class="container-md">
        <div class="mtn">
            <input type="text" class="form-control mb-3" name="searchQuery" id="searchInput" placeholder="Cerca">
            <button class="btn btn-primary btn-search" onclick="searchClick()">Cerca</button>
        </div>
        <div>
            <table class="table" <?php if($_SESSION["mode"] == "dark-mode"){echo 'data-bs-theme="dark"';}?>>
                <thead id="tableHeader">
                    <tr>
                        <th>Img</th>
                        <th>Titolo</th>
                        <th>Artista</th>
                        <th>Durata</th>
                        <th>Disponibile</th>
                        <th>Aggiungi</th>
                    </tr>
                </thead>
                <tbody id="risBrani">
                </tbody>
            </table>
        </div>
    </div>
    <script src="assets/scripts/searchScript.js"></script>
    <?php
        $searchQuery = $_GET["searchQuery"];
        echo('<script>
                searchClick(\''.$searchQuery.'\', true);
            </script>');
    ?>
    <?php include 'shared/footer.php'?>
    <script src="assets/scripts/scriptMain.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>