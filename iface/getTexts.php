<?php
/**
 * File :: getTexts.php
 *
 * Return all texts for the request languages.
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

use SYSLang\SYSLang;
use Template\Template;

require_once __ROOT__ . '/lib/vendor/autoload.php';

$syslang = new SYSLang(__ROOT__ . '/lib/langs');
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
$moteur->display();
