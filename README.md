# FoE Tool

> FoE integrated tool for quests

[FoeToolButton]: lib/img/docs/FoEToolButton.png 


## Presentation

FoE Tool is a little application made to be integrated directly in the game.
The application is fully isolated. It does not access to any data of your account.
In the future, you will be able to manipulate tool data, but these datas are stored
in a database on a dedicated server. You can find the dedicated page
of the application here : [https://foe.neoblaster.fr](https://foe.neoblaster.fr)

The aim of this tool is to get access to Wiki informations without leaving the game.
To get the tool, please follow installation instruction which follows this chapter.

Once installed, you will find a new button on **Forge Of Empire** :

![FoE Tool Button][FoeToolButton]




## Installation

**FoE Tool** require a plugin on your browser to be functionnal.
Depending of your browser, the plugin could be different.

* **Google Chrome** : [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=fr)
* **Firefox Mozilla** : [Tampermonkey](https://addons.mozilla.org/fr/firefox/addon/tampermonkey/)

Follow the instructions to install the plugin on your computer.

Once installed, open the plugin and add a new user script.
Paste the following script in the editor, save it and refresh the **Forge Of Empire**
web page. Check in the browser toolbar if the userscript is executed :

[](#import>lib/js/foe.uscript.gc.tampermonkey.js:js)
````js
// ==UserScript==
// @name         FoE - Epicure
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  FoE Epicure Guild Tool
// @author       Neoblaster
// @match        https://fr17.forgeofempires.com/game/*
// @grant        none
// @require      https://rawcdn.githack.com/neooblaster/HTML/aa9263b08705a9676416f2ba64b474daa3a62945/release/v1.4.0/HTML.min.js
// @require      https://rawcdn.githack.com/neooblaster/xhrQuery/fca64541aa77d64ba726db83e7fb2dd6fa218e30/releases/v1.4.0/xhrQuery.min.js
// @require      https://foe.neoblaster.fr/lib/js/foetool.js
// ==/UserScript==

(function() {
    'use strict';

    // Création d'un timestamp
    let now = new Date();

    // Creation d'un pont
    let bridge = document.createElement('script');
    bridge.setAttribute('id', 'FOETOOL');
    bridge.textContent = 'let FOETOOL = {};';
    document.head.appendChild(bridge);

    // Chargement de la feuille de style
    let stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', `https://foe.neoblaster.fr/lib/css/foe.css?${now.getTime()}`);
    document.head.appendChild(stylesheet);

    // Bridging des libs
    FOETOOL.HTML = HTML;
    FOETOOL.xhrQuery = xhrQuery;
    FOETOOL.FOE = new FOETool();
    FOETOOL.FOE.init();
})();
````
[](#import<lib/js/foe.uscript.gc.tampermonkey.js:js)
