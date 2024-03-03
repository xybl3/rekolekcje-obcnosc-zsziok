<?php
session_start();
require_once "db.php";
global $conn;

if(!isset($_SESSION['id'])){
    header("Location: login.php");
    exit();
}


require_once "classes.php";
global $classes;

if(isset($_POST["submit"])) {
    $namesurname = explode(" ", $_POST['name']);
    $name = $namesurname[0];
    $surname=$namesurname[1];
    $class = $_POST['class'];
    $inChurch = 1;
    $usedCode = NULL;
    $currentDate = date("Y-m-d H:i:s");

    $stmt = $conn->prepare("INSERT INTO `obecnosc`(`name`, `surname`, `class`, `sent_at`, `in_church`, `latitude`, `longitude`, `used_code`) VALUES (:name, :surname, :class, :currentDate, :inChurch, NULL, NULL, :usedCode)");
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":surname", $surname);
    $stmt->bindParam(":class", $class);
    $stmt->bindParam(":currentDate", $currentDate);
    $stmt->bindParam(":inChurch", $inChurch);
    $stmt->bindParam(":usedCode", $usedCode);
    $stmt->execute();

    $redirect = $_POST['redir'];

    $_POST = array();

    if(isset($redirect)) {
        header("Location: index.php");
        exit;
    }
}


?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dodaj obecność</title>
    <link rel="stylesheet" href="dashboard.css">
</head>
<body>
    <nav>Dodaj obecność</nav>
    <main>
        <form action="" method="post" autocomplete="off">
            <label for="name">
                <input type="text" name="name" id="name">
            </label>
            <label for="class">
                <select name="class" id="class">
                    <option value="*">Wybierz klasę</option>
                    <?php foreach($classes as $class) { ?>
                        <option value="<?php echo $class['value']; ?>"><?php echo $class['label']; ?></option>
                    <?php } ?>
                </select>
            </label>
            <input type="submit" name="submit">
            <label for="redir">
                Przekierowac na panel?:
                <input type="checkbox" name="redir" id="redir">
            </label>
        </form>
    </main>
</body>
</html>