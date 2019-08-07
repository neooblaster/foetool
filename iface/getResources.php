<?php
// Allow Cross Origin for For Of Empire
header('Access-Control-Allow-Origin: *');

// Expose res
echo file_get_contents(__ROOT__ . '/etc/resources.json');
