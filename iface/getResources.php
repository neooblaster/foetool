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

// Allow Cross Origin for Forge Of Empire
header('Access-Control-Allow-Origin: *');

// Expose Settings & Resources
echo file_get_contents(__ROOT__ . '/etc/resources.json');
