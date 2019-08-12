<?php

use MySQL\MySQL;

require_once __ROOT__ . '/lib/func/getCredentials.php';
require_once __ROOT__ . '/lib/class/MySQL/MySQL.php';

// Get overloaded credentials
$credentials = getCredentials();

// Instanciate PDO socket
$pdo = MySQL::sql(
    $credentials['database']['server'],
    $credentials['database']['database'],
    $credentials['database']['user'],
    $credentials['database']['password']
);
