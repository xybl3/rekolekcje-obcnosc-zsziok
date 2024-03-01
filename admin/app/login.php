<?php
    require_once "db.php";
    session_start();

    $error = ""; // Initialize error variable
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $username = $_POST['username'];
        $password = $_POST['password'];

        $stmt = $conn->prepare("SELECT * FROM wychowawcy WHERE login = :username");
        $stmt->bindParam(":username", $username);
        $stmt->execute();
        $user = $stmt->fetch();
        // if ($user && password_verify($password, $user['password'])) {
        if ($user && ($password == $user['password'])) {
            $_SESSION['id'] = $user['id'];
            header("Location: index.php");
            exit();
        } else {
            $error = "Niepoprawne dane logowania"; // Set error message
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <link rel="stylesheet" href="login.css">
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    </head>
    <body style="display:flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="login-container">
            <?php if (!empty($error)) { ?>
                <div class="error"><?php echo $error; ?></div> <!-- Display error banner -->
            <?php } ?>
            <h2>Zaloguj się</h2>
            <form action="#" method="post">
                <input type="text" name="username" placeholder="Login" required>
                <input type="password" name="password" placeholder="Hasło" required>
                <input type="submit" value="Login">
            </form>
        </div>
    </body>
</html>
