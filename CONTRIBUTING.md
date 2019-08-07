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






## Annexes

### Install ``NodeJS``



### Install ``mdmerge``

* Run the command ``npm install -g mdmerge``



### Install ``lessc``

* Run the command ``npm install -g less``



### Install ``less-plugin-clean-css``

* Run the command ``npm install -g less-plugin-clean-css``


