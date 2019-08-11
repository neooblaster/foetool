/**
 *  //──┐
 *  ALT+2500 = ─
 *  ALT+ 191 = ┐┐
 */
function FOETool(){
    /**
     * @type {FOETool}  Internal Variable to simplify binding.
     */
    let self = this;

    /**
     * @type {{path: {resources: string, texts: string}}}  Internal Settings.
     */
    self.settings = {
        path: {
            resources: "https://foe.neoblaster.fr/iface/getResources.php",
            texts: "https://foe.neoblaster.fr/iface/getTexts.php"
        }
    };

    /**
     * @type {HTML} HTML library.
     */
    self.HTML = HTML;

    /**
     * @type {xhrQuery} xhrQuery library.
     */
    self.xhrQuery = xhrQuery;

    /**
     * @type {{openButton: null, windows: null}}  FoE Tool HTML element referenced.
     * @private
     */
    self._HTMLElement = {
        openButton: null,
        windows: null
    };

    /**
     * @type {object}  Contains resources data.
     */
    self.res = null;

    /**
     * @type {null}  Contains texts in the expcted languages.
     */
    self.texts = null;

    /**
     * @type {{images: {}}}  Contains indexes to simplify data access
     */
    self.indexes = {
        images: {}
    };

    /**
     * @type {number}  Contains Interval instance to cleared it later.
     */
    self.waiting = null;

    /**
     * @type {Storage} localStorage  Pointeur vers window.localStorage.
     */
    self.localStorage = window.localStorage;

    /**
     * @type {{windows: {offsetX: number, offsetY: number}}}  Internal Foe Tool instance data.
     */
    self.data = {
        windows: {
            offsetX: 0,
            offsetY: 0
        }
    };



    /**
     * Group of methods to build HTMLElements.
     *
     * @returns {{openButton: openButton, windows: windows}}
     */
    self.build = function() {
        return {
            /**
             * Create the FoE Tool button and referencing it.
             */
            openButton: function() {
                let imageRes = self.res.images.list[self.indexes.images[self.res.alias.openButton]];
                let imagePath = `${self.res.images.location}/${imageRes.path}/${imageRes.name}`;

                self._HTMLElement.openButton = new self.HTML().compose({
                    attributes: {id: "FOETOpenButton"},
                    properties: {onclick: self.windows().toggle},
                    children: [{
                        classList: ['InnerBorder1'], children: [{
                            classList: ['InnerBorder2'], children: [{name: 'img', attributes:{src: imagePath}}]
                        }]
                    }]
                });
            },

            /**
             * Create the FoE Tool Windows and referencing it. Created as openned but hidden to get dimensions.
             */
            windows: function() {
                self._HTMLElement.windows = new self.HTML().compose({
                    attributes: {id: "FOETWindows", style: "visibility: hidden;"}, children: [
                        {
                            children: [
                                {
                                    name: "h1", properties: {textContent: "FoE Tool"},
                                    children: [
                                        {name: 'span', properties: {onclick: self.windows().toggle}}
                                    ]
                                },
                                {}
                            ]
                        }
                    ]
                })
            }
        };
    };

    /**
     * Perform indexation to enhance, simplify and allow access to data
     */
    self.index = function() {
        return {
            /**
             * Indexing images where the name is used as key pointing to its index number in res stack.
             */
            images: function() {
                let index = 0;
                self.res.images.list.map(function(el) {
                    this.indexes.images[el.name] = index;
                    index++;
                }.bind(self));
            }
        };
    };

    /**
     * Initialize the system.
     */
    self.init = function() {
        // Loading Resources
        let xhrGetRes = new self.xhrQuery();
        xhrGetRes.target(self.settings.path.resources);
        xhrGetRes.callbacks(function(response) {
            try {
                response = JSON.parse(response);
                this.res = response;
            } catch (err) {
                console.error("FOETool.init(), XHR response failed for resources on", response, err);
            }
        }.bind(self));
        xhrGetRes.send();

        // Loading Texts
        let xhrGetTexts = new self.xhrQuery();
        xhrGetTexts.target(self.settings.path.texts);
        xhrGetTexts.values('lang=fr-FR');
        xhrGetTexts.callbacks(function(response) {
            try {
                response = JSON.parse(response);
                this.texts = response;
            } catch (err){
                console.error("FOETool.init(), XHR response failed for texts on", response, err);
            }
        }.bind(self));
        xhrGetTexts.send();

        // Wait for XHR answers
        self.waiting = setInterval(function() {
            if (self.res && self.texts) {
                // Indexing
                self.index().images();

                // Building
                self.build().openButton();
                self.build().windows();

                // Appending HTMLElement
                document.body.appendChild(self._HTMLElement.openButton);
                document.body.appendChild(self._HTMLElement.windows);

                // Settings
                //──┐ Configuring the Windows
                //    - Set Position
                //    - Close the windows
                //    - Set visible
                self.windows().setPosition(
                    window.innerWidth - self.windows().self().offsetWidth - 15,
                    window.innerHeight - self.windows().self().offsetHeight - 130,
                );
                // Close the popup and set visible
                self.windows().close();
                self.windows().self().style.visibility = 'visible';

                // Event Attachment
                window.addEventListener('resize', function() {
                    self.windows().setPosition(
                        window.innerWidth - self.windows().self().offsetWidth - 15, // Use self.data.windows.offsetX
                        window.innerHeight - self.windows().self().offsetHeight - 130, // Use self.data.windows.offsetY
                    );
                });

                clearInterval(self.waiting);
            }
        }, 100);
    };

    /**
     * A easy way to manipulate locatStorage object.
     *
     * @return {{get: get, set: set, del: del}}
     */
    self.ls = function() {
        let prefix = 'FoETool-';

        return {
            /**
             * Récupère la donnée stockée localement à l'aide de l'argument name
             *
             * @param {String} name  Nom de la donnée stockée.
             */
            get: function(name){
                return self.localStorage.getItem(prefix + name);
            },

            /**
             * Définit / Met à jour une donnée stockée localement.
             *
             * @param {String} name  Nom de la donnée à manipuler.
             * @param {mixed} value  Valeur à assigné à la donnée.
             *
             * @return {boolean}
             */
            set: function(name, value){
                self.localStorage.setItem(prefix + name, value);
                return true;
            },

            /**
             * Supprimer la donnée stockée localement
             *
             * @param {String} name  Nom de la donnée à supprimée.
             */
            del: function(name) {
                self.localStorage.removeItem(prefix + name);
            }
        }
    };

    /**
     * Group of method to manipulate FoE Tool windows.
     *
     * @returns {{open: open, close: close, toggle: toggle, setTitle: setTitle}}
     */
    self.windows = function() {
        return {
            /**
             * Opens the FoE Tool Windows
             */
            open: function() {
                self._HTMLElement.windows.removeAttribute('hidden');
            },

            /**
             * Close the FoE Tool Windows
             */
            close: function() {
                self._HTMLElement.windows.setAttribute('hidden', '');
            },

            /**
             * Opens/Closes the FoE Tool Windows
             */
            toggle: function() {
                self._HTMLElement.windows.hasAttribute('hidden') ? self.windows().open() : self.windows().close();
            },

            /**
             * @returns {HTMLElement}  Return the Windows HTMLElement.
             */
            self: function() {
                return self._HTMLElement.windows;
            },

            setPosition: function(x, y, unit = 'px') {
                self._HTMLElement.windows.style.left = `${x}${unit}`;
                self._HTMLElement.windows.style.top = `${y}${unit}`;
            },

            /**
             * Set the povided title in the Window header bar
             *
             * @param title
             */
            setTitle: function(title) {
                self._HTMLElement.windows.querySelector('h1').textContent = `${self.texts.WINDOW_TITLE_PREFIX} - ${title}`;
            }
        };
    };



    /**
     * Returning self for making successive calls.
     */
    return self;
}

