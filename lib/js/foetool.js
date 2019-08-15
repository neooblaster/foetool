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
        images: {},
        content: {},
        contentOptions: {}
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
                    attributes: {id: "FOETOpenButton", title: self.texts.OPEN_BUTTON_TITLE},
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
                // Get latest displayed content
                let latestContent = self.ls().get('content');

                // Create a button by content
                let contents = [];

                self.res.content.map(function(content) {
                    let classList = [];

                    // If undefined, set the first one as active + storing
                    latestContent = latestContent || content.NAME;
                    if (latestContent === content.NAME) {
                        classList.push('active');
                        self.ls().set('content', content.NAME);
                    }

                    // Push a HTML structure to build the button
                    contents.push({
                        classList: classList,
                        attributes: {id: content.NAME},
                        properties: {
                            textContent: self.texts[content.NAME],
                            onclick: self.windows().selectContent.bind(self, content.NAME)
                        }
                    })
                });

                // Create the popup
                let windows = {
                    attributes: {id: "FOETWindows", style: "visibility: hidden;"}, children: [
                        {
                            children: [
                                {
                                    name: "h1",
                                    children: [
                                        {name: 'span', properties: {textContent: "FoE Tool"}},
                                        {
                                            name: 'span',
                                            properties: {onclick: self.windows().toggle},
                                            attributes: {id: "closeButton", title: self.texts.CLOSE_BUTTON_TITLE}
                                        }
                                    ]
                                },
                                {
                                    children: [
                                        {attributes: {id: "menu"}, children: contents},
                                        {attributes: {id: "content"}},
                                    ]
                                },
                                {
                                    name: "footer"
                                }
                            ]
                        }
                    ]
                };

                // Memorize generated popup
                self._HTMLElement.windows = new self.HTML().compose(windows);
            },

            /**
             * Create the contentOptions
             */
            contentOptions: function(contentId) {
                let content = self.windows().getContent();
                let options = [];

                content.innerHTML = '';

                self.res.contentOptions.map(function(option) {
                   if (option.CONTENT === contentId) options.push(option);
                });

                options.map(function(option) { //<div class="contentOption"><span>VIKING</span></div>
                    console.log('appendchild', content, option);
                    content.appendChild(new self.HTML().compose({
                        classList: ['contentOption'], children: [
                            {name: 'span', properties: {textContent: self.texts[option.NAME]}}
                        ]
                    }));
                });
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
                self.index().index(self.res.images.list, self.indexes.images, ['name']);
            },

            /**
             * Indexing contents where ID and NAME poiting to its index number in res stack.
             */
            content: function() {
                self.index().index(self.res.content, self.indexes.content, ['ID', 'NAME']);
            },

            /**
             * Indexing contentOptions where ID and NAME poiting to its index number in res stack.
             */
            contentOptions: function() {
                self.index().index(self.res.contentOptions, self.indexes.contentOptions, ['ID', 'NAME']);
            },

            /**
             * Generic method for indexation.
             *
             * @param {Array}  src   Array source contening data.
             * @param {object} index Target object to make mapping between key and index number.
             * @param {Array}  keys  Key to index in the target object.
             */
            index: function(src, index, keys = []) {
                let idxnr = 0;

                src.map(function(el) {
                    keys.map(function(key) {
                        index[el[key]] = idxnr;
                    });
                    idxnr++
                });
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
                self.index().content();
                self.index().contentOptions();

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
                self.windows().selectContent(self.ls().get('content'));

                // Event Attachment
                window.addEventListener('resize', function() {
                    self.windows().setPosition(
                        window.innerWidth - self.windows().self().offsetWidth - 15, // Use self.data.windows.offsetX
                        window.innerHeight - self.windows().self().offsetHeight - 130, // Use self.data.windows.offsetY
                    );
                });

                // Checking version
                let latestVer = self.ls().get('latestVer');
                if (latestVer && latestVer !== self.res.version) {
                    // Notification without TTL.
                    self.windows().notify().open(2, self.texts.TOOL_UPDATED);
                }
                self.ls().set('latestVer', self.res.version);

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
             * Return the windows body element.
             *
             * @returns {Element} Windows body element.
             */
            getContent: function() {
                return self._HTMLElement.windows.querySelector('#content');
            },

            /**
             * Remove all classes apply on the #content element.
             * Purpose of classes on this element is to define behavior.
             */
            removeContentClass: function() {
                let content = self.windows().getContent();

                content.classList.forEach(function(classe) {
                    this.classList.remove(classe);
                }.bind(content));
            },

            /**
             * @returns {HTMLElement}  Return the Windows HTMLElement.
             */
            self: function() {
                return self._HTMLElement.windows;
            },

            /**
             * Place the windows to the LEFT TOP position in the specified unit (default in px).
             *
             * @param {number} x     Left offset from the browser screen.
             * @param {number} y     Top  offset from the browser screen.
             * @param {string} unit  Unit for the specified values x and y.
             */
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
                self._HTMLElement.windows.querySelector('h1 span:first-child').textContent = `${self.texts.WINDOW_TITLE_PREFIX} - ${title}`;
            },

            /**
             * Make the requested content.
             *
             * @param {string} content  Name of the content we request to set in the windows body.
             * @param {string} type     Type of content we request to set in the windows body.
             */
            setContent: function(content, type) {
                let contentElmt = self.windows().getContent();

                self.windows().removeContentClass();

                switch (type) {
                    case 'option':
                        contentElmt.classList.add('options');
                        self.build().contentOptions(self.res.content[self.indexes.content[content]]['ID']);
                        break
                }
            },

            /**
             * Select the requested content.
             *
             * @param content
             */
            selectContent: function(content) {
                self._HTMLElement.windows.querySelectorAll('#menu div').forEach(function(button) {
                    button.classList.remove('active');
                });
                self._HTMLElement.windows.querySelector(`#${content}`).classList.add('active');
                self.ls().set('content', content);
                self.windows().setTitle(self.texts[content]);
                self.windows().setContent(content, 'option');
            },

            selectOption: function(option) {

            },

            /**
             * Notification manager for the windows
             *
             * @returns {{open: open, close: close}}
             */
            notify: function() {
                let notif = self._HTMLElement.windows.querySelector('footer');
                let levels = ['info', 'success', 'warn', 'error'];

                return {
                    /**
                     * Open the notification bar.
                     *
                     * @param {number} level    Level of the notification range : [0,3].
                     * @param {string} message  Message to enter in the notification bar.
                     * @param {number} ttl      Time To Live of the notification in ms.
                     */
                    open: function(level, message, ttl = 0) {
                        self.windows().notify().close();
                        self._HTMLElement.windows.classList.add('notified');
                        self._HTMLElement.windows.classList.add(levels[level]);
                        notif.textContent = message;

                        if (ttl) {
                            setTimeout(self.windows().notify().close, ttl);
                        }
                    },

                    /**
                     * Close the notification whatever the current level.
                     */
                    close: function() {
                        self._HTMLElement.windows.classList.remove('notified');
                        levels.map(function(level) {
                            self._HTMLElement.windows.classList.remove(levels[level]);
                        });
                    }
                }
            }
        };
    };



    /**
     * Returning self for making successive calls.
     */
    return self;
}

