<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet/less" type="text/css" href="lib/less/foe.less"/>
    <!--    <link rel="stylesheet" type="text/css" href="lib/css/foe.css" />-->
    <script src="//cdnjs.cloudflare.com/ajax/libs/less.js/3.9.0/less.min.js"></script>
    <script src="https://rawcdn.githack.com/neooblaster/HTML/aa9263b08705a9676416f2ba64b474daa3a62945/release/v1.4.0/HTML.min.js"></script>
    <script src="https://rawcdn.githack.com/neooblaster/xhrQuery/fca64541aa77d64ba726db83e7fb2dd6fa218e30/releases/v1.4.0/xhrQuery.min.js"></script>
    <script src="lib/js/foe.js"></script>
    <script src="lib/js/foetool.js"></script>
    <script src="lib/js/bootstrap.js"></script>
    <script type="text/javascript">
        let FOETOOL = {};
    </script>
    <title>FoE Tool</title>
</head>
<body id="FoEToolIndexPage" onload="bootstrap();">
    <h1><img src="lib/img/foe-logo.png" alt="Forge Of Empire Tool"></h1>


    <div id="FOETWindows" class="notified error" style="visibility: visible; left: 50px; top: 50px;">
        <div>
            <h1>
                <span>FoE Tool - Colonies</span>
                <span
                        id="closeButton" title="Fermer FoE Tool"></span>
            </h1>
            <div>
                <div id="menu">
                    <div id="CONTENT_GM">GM</div>
                    <div id="CONTENT_QUESTS">Quêtes</div>
                    <div class="active" id="CONTENT_COLONY">Colonies</div>
                </div>
                <div id="content"></div>
            </div>
            <footer>
                Nouvelle version disponible
            </footer>
        </div>
    </div>

    <footer>
        <a href="https://www.ssllabs.com/ssltest/analyze.html?d=foe.neoapps.fr">Evaluation SSL</a>
        •
        <a href="https://github.com/neooblaster/foetool">Sources GitHub</a>
    </footer>

</body>
</html>