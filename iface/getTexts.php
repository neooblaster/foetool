<?php
/**
 * File :: getTexts.php
 *
 * Return all texts for the request languages.
 *
 * @author    Nicolas DUPRE
 * @release   11/08/2019
 * @version   0.2.0
 * @package   Index
 *
 *
 *
 * Version 0.2.0 : 11/08/2019 : NDU
 * -------------------------------
 *  Add request input 'lang' for Syslang
 *
 *
 * Version 0.1.0 : 09/08/2019 : NDU
 * -------------------------------
 *  Initial Version
 *
 */

use SYSLang\SYSLang;
use Template\Template;

require_once __ROOT__ . '/lib/vendor/autoload.php';

// Read input
$lang = ($_REQUEST['lang'])?: 'fr-FR';

$syslang = new SYSLang(__ROOT__ . '/lib/langs');
$syslang->setLanguage($lang);
$texts = $syslang->getTexts('common.xml');
$clientText = $texts['CLIENT'];

array_rmap(function ($text) {
    $text['VAR_VALUE'] = addcslashes($text['VAR_VALUE'], '"');
    $text['COMMA'] = ',';
    return $text;
}, $clientText);
$clientText[0]['COMMA'] = '';

$moteur = new Template();
$moteur->set_template_file(__ROOT__ . '/lib/templates/texts.tpl.json');
$moteur->set_output_name('text.json');
$moteur->set_temporary_repository(__ROOT__ . '/var/tmp');
$moteur->set_var('TEXTS', $clientText);
$moteur->render();

// Allow Cross Origin for Forge Of Empire
header('Access-Control-Allow-Origin: *');

$moteur->display();
