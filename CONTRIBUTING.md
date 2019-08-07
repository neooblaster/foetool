# How to contribute

Before contributing to the project, 
please read this file first.


## Get started

If you perform modifications, depending of file modified
your have to run some command lines to update, build or compile
resources. All command line are available in the **Annexes** section
to find how to get them.

Do not perform modifications on the file ``foe.css``.
This file is built from file ``foe.less``



## Todo when I change a file


### Change on ``README.md``



### Change on ``foe.uscript.gc.tampermonkey.js``

* Run the command ``mdmerge README.md``



### Change on ``foe.less``

* Run the command ``lessc --clean-css lib/less/foe.less lib/css/foe.css``






## Working Principles


### Engine ``FOETool``

The JavaScript class ``foetool`` is the main class executed
by the User Script under **Tampermonkey** (or other).
The script is loaded as ``require`` dependency.

To developt and to get same features on the website,
this class is also used in file ``index.php``.
To reproduce the behavior of the browser plugin,
I created a file ``bootstrap`` to reproduce initialization
steps.






## Annexes

### Install ``NodeJS``



### Install ``mdmerge``

* Run the command ``npm install -g mdmerge``



### Install ``lessc``

* Run the command ``npm install -g less``



### Install ``less-plugin-clean-css``

* Run the command ``npm install -g less-plugin-clean-css``


