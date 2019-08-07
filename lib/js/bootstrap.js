function bootstrap(){
    'use strict';

    // Creation d'un pont
    // => Script tag available in file index.php

    // Chargement de la feuille de style
    // => Directly load by link tag

    // Bridging des libs
    FOETOOL.HTML = HTML;
    FOETOOL.xhrQuery = xhrQuery;
    FOETOOL.FOE = new FOETool();
    FOETOOL.FOE.init();
}
