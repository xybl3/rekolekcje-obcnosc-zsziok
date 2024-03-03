<?php
session_start();

require_once "db.php";
global $conn;

if(!isset($_SESSION['id'])){
    header("Location: login.php");
    exit();
}

$teacher_stmt = $conn->prepare("SELECT * FROM wychowawcy WHERE id = :id");
$teacher_stmt->bindParam(":id", $_SESSION['id']);
$teacher_stmt->execute();
$teacher = $teacher_stmt->fetch();

$sql = "SELECT `obecnosc`.`id`, `obecnosc`.`name`, `obecnosc`.`surname`, `obecnosc`.`class`, `obecnosc`.`sent_at`, `obecnosc`.`in_church`, `obecnosc`.`latitude`, `obecnosc`.`longitude`, `kody`.`code` FROM `obecnosc` LEFT JOIN `kody` ON `kody`.`id` = `obecnosc`.`used_code` WHERE 1";

if($teacher['class'] != "*") {
    $sql .= " AND `obecnosc`.`class` = :teacherClass";
}

if(isset($_GET['date'])) {
    $sql .= " AND DATE(`obecnosc`.`sent_at`) = :date";
}

if(isset($_GET['selectedClass']) && $_GET['selectedClass'] != "*") {
    $sql .= " AND `obecnosc`.`class` = :selectedClass";
}

if(isset($_GET['show']) && $_GET['show'] == "inChurch") {
    $sql .= " AND `obecnosc`.`in_church` = 1";
} else if(isset($_GET['show']) && $_GET['show'] == "notInChurch") {
    $sql .= " AND `obecnosc`.`in_church` = 0";
}
else if(isset($_GET['show']) && $_GET['show'] == "all") {
    $sql .= "";
}

if(isset($_GET['sort']) && $_GET['sort'] == "asc") {
    $sql .= " ORDER BY `obecnosc`.`sent_at` ASC";
} else {
    $sql .= " ORDER BY `obecnosc`.`sent_at` DESC";
}


$students_stmt = $conn->prepare($sql);

if ($teacher['class'] != "*") {
    $students_stmt->bindParam(":teacherClass", $teacher['class']);
}

if (isset($_GET['date'])) {
    $students_stmt->bindParam(":date", $_GET['date']);
}

if(isset($_GET['selectedClass']) && $_GET['selectedClass'] != "*") {
    $lower_class = strtolower($_GET['selectedClass']);
    $students_stmt->bindParam(":selectedClass", $lower_class);
}

$students_stmt->execute();
$students = $students_stmt->fetchAll(PDO::FETCH_ASSOC);

require_once "classes.php";
global $classes;


?>




<!DOCTYPE html>
<html lang="en" class="dark-theme">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel</title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <nav>
        <p>Witaj <?php echo $teacher['name']; ?>!</p>
        <div>
            <button id="themeToggle">
                <i class="fas fa-moon"></i> <!-- Change this to moon icon for dark mode -->
            </button>
            <a href="logout.php">Wyloguj</a>
        </div>
    </nav>

    <main>
        <form method="get">
            <label for="date">
                Wybierz datę:
                <input type="date" name="date" value="<?php echo isset($_GET['date']) ? $_GET['date'] : date('Y-m-d'); ?>">
            </label>
            <?php if($teacher["class"] == "*") { ?>
            <label for="class">
                Wybierz klasę:
                <select name="selectedClass" id="selectedClass">
                    <option value="*">Wszystkie klasy</option>
                    <?php foreach($classes as $class) { ?>
                        <option value="<?php echo $class['value']; ?>" <?php if(isset($_GET['selectedClass']) && $_GET['selectedClass'] == $class['value']) echo "selected"; ?>><?php echo $class['label']; ?></option>
                    <?php } ?>
                </select>
            </label>
            <?php } ?>

            <label for="show">
                Pokaż:
                <select name="show" id="show" >
                   <?php
                    $opt = array(
                        "all" => "Wszystkich", 
                        "inChurch" => "Tych którzy byli w kościele", 
                        "notInChurch" => "Tych którzy nie byli w kościele");
                    foreach($opt as $option => $value) { ?>
                        <option value="<?php echo $option; ?>" <?php if(isset($_GET['show']) && $_GET['show'] == $option) echo "selected"; ?>><?php echo $value; ?></option>
                        <?php }
                   ?>
                </select>
            </label>

            <label for="sort">
                Sortuj:
                <select name="sort" id="sort">
                    <option value="desc" <?php if(isset($_GET["sort"]) && $_GET["sort"] == "desc") echo "selected"; ?> >Od ostatniego</option>
                    <option value="asc" <?php if(isset($_GET["sort"]) && $_GET["sort"] == "asc") echo "selected"; ?> >Od najstarszego</option>
                </select>
            </label>

            <div>
                <input type="submit" value="Filtruj">
                <a href="/add_presence.php" class="button">Dodaj obecność</a>
            </div>
        </form>
        <table>
                <thead>
                    <tr>
                        <th>LP</th>
                        <th>Imie</th>
                        <th>Nazwisko</th>
                        <th>Klasa</th>
                        <th>Data wysłania</th>
                        <th>Był w kościele</th>
                        <th>Szerokość</th>
                        <th>Długość</th>
                        <th>Uzyty kod</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        if(count($students) == 0) {
                            echo "<tr><td colspan='9'>Brak wyników</td></tr>";
                        }
                    ?>
                    <?php foreach($students as $key => $student) { ?>
                        <tr>
                            <td><?php echo $key + 1; ?></td>
                            <td><?php echo $student['name']; ?></td>
                            <td><?php echo $student['surname']; ?></td>
                            <td><?php echo $student['class']; ?></td>
                            <td><?php echo $student['sent_at']; ?></td>
                            <td><?php echo ($student['in_church'] == 0 ? "NIE":"TAK"); ?></td>
                            <td><?php echo $student['latitude']; ?></td>
                            <td><?php echo $student['longitude']; ?></td>
                            <td><?php echo $student['code']; ?></td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
    </main>
</body>
 <script>
        // Function to toggle theme
        function toggleTheme() {
            const html = document.querySelector('html');
            html.classList.toggle('light-theme');
            html.classList.toggle('dark-theme');

            // Save theme preference to localStorage
            const isDarkMode = html.classList.contains('dark-theme');
            localStorage.setItem('darkMode', isDarkMode);
        }

        // Check for theme preference in localStorage
        const isDarkMode = localStorage.getItem('darkMode') === 'true';

        // Apply the theme preference
        if (isDarkMode) {
            document.querySelector('html').classList.add('dark-theme');
        } else {
            document.querySelector('html').classList.remove('dark-theme')
            document.querySelector('html').classList.add('light-theme');
        }

        // Theme switcher button
        const themeToggleBtn = document.getElementById('themeToggle');
        themeToggleBtn.addEventListener('click', toggleTheme);
    </script>
</html>