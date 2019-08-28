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
$version = json_decode(file_get_contents(__ROOT__ . '/etc/version.json'), true);
$resources = json_decode(file_get_contents(__ROOT__ . '/etc/resources.json'), true);
$resources = array_replace_recursive($resources, $version);

$sectionsId = [];
$optionsId = [];


// Load Sections from database
try {
    $stmt = $pdo->prepare('SELECT * FROM sections WHERE enabled = 1');
    $stmt->execute();
    $sections = $stmt->fetchAll(PDO::FETCH_ASSOC);

    array_rmap(function ($section) use (&$sectionsId) {
        $sectionsId[] = $section['id'];
        $section['enabled'] = ord($section['enabled']);
        return $section;
    }, $sections);

    foreach ($sections as $section) {
        $resources['sections'][] = $section;
    }
} catch (PDOException $err) {

}

// Load Sections Options from database only for enabled sections
if (count($sectionsId)) {
    try {
        $sectionList = join(',', $sectionsId);
        $stmt = $pdo->prepare(
            "SELECT * FROM section_option WHERE section IN ($sectionList) and enabled = 1"
        );
        $stmt->execute();
        $plugins = $stmt->fetchAll(PDO::FETCH_ASSOC);

        array_rmap(function ($options) use (&$optionsId) {
            $optionsId[] = $options['id'];
            $options['enabled'] = ord($options['enabled']);
            return $options;
        }, $plugins);

        foreach ($plugins as $plugin) {
            $resources['sectionOptions'][] = $plugin;
        }
    } catch(PDOException $err){

    }
}

// Load Registred Plugins
try {
    $stmt = $pdo->prepare('SELECT * FROM plugin WHERE enabled = 1');
    $stmt->execute();
    $plugins = $stmt->fetchAll(PDO::FETCH_ASSOC);

    array_rmap(function ($plugin) {
        $plugin['enabled'] = ord($plugin['enabled']);
        return $plugin;
    }, $plugins);

    foreach ($plugins as $plugin) {
        $resources['plugins'][] = $plugin;
    }
} catch(PDOException $err){

}

// Load Content Type
try {
    $stmt = $pdo->prepare('SELECT * FROM content_type');
    $stmt->execute();
    $contentTypes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $resources['contentTypes'] = $contentTypes;
} catch(PDOException $err){

}

// Load Contents
if (count($optionsId)) {
    $optionList = join(',', $optionsId);

    // Load Content Plugin
    try {
        $stmt = $pdo->prepare(
            "SELECT * FROM content_plugin WHERE section_option IN ($optionList) and enabled = 1"
        );
        $stmt->execute();
        $contentPlugin = $stmt->fetchAll(PDO::FETCH_ASSOC);

        array_rmap(function ($contentPlugin) {
            $contentPlugin['enabled'] = ord($contentPlugin['enabled']);
            return $contentPlugin;
        }, $contentPlugin);

        $resources['contentPlugins'] = $contentPlugin;
    } catch (PDOException $err) {

    }
}


// Allow Cross Origin for Forge Of Empire
header('Access-Control-Allow-Origin: *');

// Expose Settings & Resources
echo json_encode($resources, JSON_NUMERIC_CHECK);
