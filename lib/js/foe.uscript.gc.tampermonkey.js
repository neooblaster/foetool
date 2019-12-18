// ==UserScript==
// @name         FoE - Epicure
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  FoE Epicure Guild Tool
// @author       Neoblaster
// @match        https://fr17.forgeofempires.com/game/*
// @grant        none
// @require      https://rawcdn.githack.com/neooblaster/HTML/aa9263b08705a9676416f2ba64b474daa3a62945/release/v1.4.0/HTML.min.js
// @require      https://rawcdn.githack.com/neooblaster/xhrQuery/fca64541aa77d64ba726db83e7fb2dd6fa218e30/releases/v1.4.0/xhrQuery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/less.js/3.9.0/less.min.js
// @require      https://foe.neoapps.fr/lib/js/DOMTokenList.clear.js
// @require      https://foe.neoapps.fr/lib/js/foetool.js
// ==/UserScript==

(function() {
    'use strict';

    let domainName = 'foe.neoapps.fr';

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
    stylesheet.setAttribute('href', `https://${domainName}/lib/css/foe.css?${now.getTime()}`);
    document.head.appendChild(stylesheet);

    // Bridging des libs
    FOETOOL.HTML = HTML;
    FOETOOL.xhrQuery = xhrQuery;
    FOETOOL.FOE = new FOETool();
    FOETOOL.FOE.init();
})();