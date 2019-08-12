<?php
/**
 * File :: getResources.php
 *
 * To allows CORS, we use a PHP Script as interface to download
 * the resources.json file containing all settings
 *
 * @author    Nicolas DUPRE
 * @release   09/08/2019
 * @version   0.1.0
 * @package   Index
 *
 *
 *
 * Version 0.1.0 : 09/08/2019 : NDU
 * -------------------------------
 *
 *
 */
// Get PDO Socket
require_once __ROOT__ . '/init/init.pdo.php';

// Load Resource Files
$resources = json_decode(file_get_contents(__ROOT__ . '/etc/resources.json'), true);


// Load Contents from database
try {
    $stmt = $pdo->prepare('SELECT * FROM content');
    $stmt->execute();
    $resources['content'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $err) {

}


// Allow Cross Origin for Forge Of Empire
header('Access-Control-Allow-Origin: *');

// Expose Settings & Resources
echo json_encode($resources);
