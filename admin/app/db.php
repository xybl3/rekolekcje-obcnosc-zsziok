<?php

// try {
//     $pdo = new PDO("mysql:host=172.27.0.2;dbname=rekolekcje", "root", "$4**jd!@kdLL");
//     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//     echo "Connected successfully";
// } catch(PDOException $e) {
//     echo "Connection failed: " . $e->getMessage();
// }



$conn = new PDO("mysql:host=mysql;dbname=rekolekcje", "root", "$4**jd!@kdLL");
// $conn = new PDO("mysql:host=127.0.0.1;dbname=rekolekcje", "root", "");