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
            resources: "https://foedev.neoblaster.fr/iface/getResources.php",
            texts: "https://foedev.neoblaster.fr/iface/getTexts.php",
            plugins: "https://foedev.neoblaster.fr/var/plugins"
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
     * @type {less} Lesscss Library
     */
    self.less = less;

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
     * @type {null}  Contain all texts in all registred languages.
     */
    self.alltexts = null;

    /**
     * @type {{images: {}}}  Contains indexes to simplify data access
     */
    self.indexes = {
        images: {},
        sections: {},
        sectionOptions: {},
        contentTypes: {},
        plugins: {},
        contentPlugins: {}
    };

    /**
     * @type {Array}  Contains Intervals instance to cleared them later.
     */
    self.intervals = [];

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
     * @type {{started: boolean, registred: number, loaded: number, plugins: {}}}  FoETools Plugins Data.
     */
    self.plugins = {
        started: false,
        registred: 0,
        loaded: 0,
        names: [],
        plugins: {

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
                let lastSection = self.ls().get('section');

                // Create a button by section
                let sections = [];

                self.res.sections.map(function(section) {
                    if (!section.enabled) return;

                    let classList = [];

                    // If undefined, set the first one as active + storing
                    lastSection = lastSection || section.name;
                    if (lastSection === section.name) {
                        classList.push('active');
                        self.ls().set('section', section.name);
                    }

                    // Push a HTML structure to build the button
                    sections.push({
                        classList: classList,
                        attributes: {id: section.name},
                        properties: {
                            textContent: self.texts[section.name],
                            onclick: self.windows().selectSection.bind(self, section.name)
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
                                        {attributes: {id: "menu"}, children: sections},
                                        {
                                            attributes: {id: "wrapper"}, children: [
                                                {attributes: {id: "options"}},
                                                {attributes: {id: "content"}}
                                            ]
                                        },
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
             * Create the sectionOptions
             */
            sectionOptions: function(sectionId) {
                let content = self._HTMLElement.windows.querySelector('#options');
                let options = [];

                content.innerHTML = '';

                self.res.sectionOptions.map(function(option) {
                    if (option.section === sectionId) options.push(option);
                });

                options.map(function(option) {
                    if (!option.enabled) return;
                    content.appendChild(new self.HTML().compose({
                        classList: ['sectionOption'], children: [
                            {name: 'span', properties: {textContent: self.texts[option.name]}}
                        ],
                        properties: {
                            onclick: self.windows().selectOption.bind(self, option)
                        }
                    }));
                });
            }
        };
    };

    /**
     * Group of methods to perform internal process of FoETool.
     *
     * @returns {{resources: resources, texts: texts, plugins: plugins}}
     */
    self.controller = function() {
        return {
            /**
             * FoETool Resources Manager.
             *
             * @returns {{load: load}}
             */
            resources: function() {
                return {
                    /**
                     * Load asynchronously resource data from the server.
                     */
                    load: function() {
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
                    }
                }
            },

            /**
             * FoETool Texts Manager.
             *
             * @returns {{load: load}}
             */
            texts: function() {
                return {
                    /**
                     * Load asynchronously FoETool texts from the server.
                     */
                    load: function() {
                        let xhrGetTexts = new self.xhrQuery();
                        xhrGetTexts.target(self.settings.path.texts);
                        xhrGetTexts.values('lang=fr-FR');
                        xhrGetTexts.callbacks(function(response) {
                            try {
                                response = JSON.parse(response);
                                this.alltexts = response;
                                this.texts = this.alltexts['fr-FR'];
                            } catch (err){
                                console.error("FOETool.init(), XHR response failed for texts on", response, err);
                            }
                        }.bind(self));
                        xhrGetTexts.send();
                    }
                };
            },

            /**
             * Plugins Manager.
             *
             * @returns {{load: load, init: init}}
             */
            plugins: function() {
                return {
                    /**
                     * Load asynchronously library file for the plugin.
                     */
                    load: function() {
                        self.res.plugins.map(function(plugin) {
                            self.plugins.registred++;

                            document.head.appendChild(new self.HTML().compose({
                                name: "script", attributes: {src: `${self.settings.path.plugins}/${plugin.name}/${plugin.name}.js`},
                                properties: {
                                    onload: function(evt) {
                                        self.plugins.loaded++;
                                        self.plugins.names.push(plugin.name);
                                        let Plugin = window[plugin.name];
                                        self.plugins.plugins[`${plugin.name}`] = new Plugin(self);
                                    },
                                    onerror: function() {
                                        self.plugins.loaded++;

                                        self.intervals[`${plugin.name}`] = setInterval(function() {
                                            if (self._HTMLElement.windows) {
                                                self.windows().notify().open(3, `Erreur Plugin "${plugin.name}"`, 0);
                                                clearInterval(self.intervals[`${plugin.name}`]);
                                            }
                                        }, 100)
                                    }
                                }
                            }));
                        });

                        self.plugins.started = true;
                    },

                    /**
                     * Initialize all loaded plugins
                     */
                    init: function() {
                        self.plugins.names.forEach(function(plugin) {
                            if (self.plugins.plugins[plugin] && self.plugins.plugins[plugin].init) {
                                let Plugin = self.plugins.plugins[plugin];

                                // Settings Host for Plugin
                                Plugin.host = self.windows().getContent();

                                // Loading Plugin Resources
                                Plugin.stylesheets.map(function(stylesheet) {
                                    let path = `${self.settings.path.plugins}/${plugin}/${stylesheet.sheet}.${stylesheet.type.toLowerCase()}`;
                                    let rel = "stylesheet";
                                    let type = "text/css";

                                    switch (stylesheet.type.toLowerCase()) {
                                        case 'less':
                                            rel = "stylesheet/less";
                                            break;
                                    }

                                    console.log(path);

                                    document.head.appendChild(new self.HTML().compose({
                                        name: "link", attributes: {
                                            rel: rel,
                                            type: type,
                                            href: path
                                        }
                                    }));
                                });

                                // Loading Plugin texts
                                [''].concat(Plugin.languages).map(function(lang) {
                                    let langExt = (lang) ? `.${lang}` : '';
                                    let file = `${plugin}.texts${langExt}.json`;
                                    let path = `${self.settings.path.plugins}/${plugin}/${file}`;

                                    // The texts file Plugin.texts.json is for defaultLanguage (Lang = '')
                                    if (!lang) lang = Plugin.defaultLanguage;

                                    new self.xhrQuery()
                                        .target(path)
                                        .method('GET')
                                        .callbacks(function(response) {
                                            try {
                                                response = JSON.parse(response);
                                                // Overloading Texts
                                                for(let key in response) {
                                                    if (!Plugin.alltexts[lang]) Plugin.alltexts[lang] = {};
                                                    Plugin.alltexts[lang][key] = response[key];
                                                }
                                            } catch (err) {
                                                console.error(`The text file '${file}' of plugin '${plugin}' is not valid`)
                                            }
                                        })
                                        .send();
                                });

                                // Initialize Plugin
                                Plugin.init();
                            }
                        });
                    }
                };
            }
        }
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
             * Indexing sections where 'id' and 'name' poiting to its index number in res stack.
             */
            sections: function() {
                self.index().index(self.res.sections, self.indexes.sections, ['id', 'name']);
            },

            /**
             * Indexing sectionOptions where 'id' and 'name' poiting to its index number in res stack.
             */
            sectionOptions: function() {
                self.index().index(self.res.sectionOptions, self.indexes.sectionOptions, ['id', 'name']);
            },

            /**
             * Indexing contentTypes where 'id' and 'type' pointing to its index number in res stack.
             */
            contentTypes: function() {
                self.index().index(self.res.contentTypes, self.indexes.contentTypes, ['id', 'type']);
            },

            /**
             * Indexing contentTypes where 'id' and 'type' pointing to its index number in res stack.
             */
            plugins: function() {
                self.index().index(self.res.plugins, self.indexes.plugins, ['id', 'name']);
            },


            /**
             * Indexing contentTypes where 'id' and 'type' pointing to its index number in res stack.
             */
            contentPlugins: function() {
                self.index().index(self.res.contentPlugins, self.indexes.contentPlugins, ['section_option']);
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
        self.controller().resources().load();     // Loading Resources
        self.controller().texts().load();         // Loading Texts

        // Wait for XHRs
        self.intervals['init'] = setInterval(function() {
            // Load plugins library
            if (self.res && !self.plugins.started) self.controller().plugins().load();

            if (
                self.res &&
                self.texts &&
                (self.plugins.registred === self.plugins.loaded)
            ) {
                // Indexing
                self.index().images();
                self.index().sections();
                self.index().sectionOptions();
                self.index().contentTypes();
                self.index().plugins();
                self.index().contentPlugins();

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
                self.windows().selectSection(self.ls().get('section'));

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

                // Initialization of plugins
                self.controller().plugins().init();

                // Refreshing LESS File
                self.less.registerStylesheets();
                self.less.refresh();

                clearInterval(self.intervals['init']);
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
     * Group of methods to manipulate FoE Tool windows.
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
                self._HTMLElement.windows.classList.remove('content');
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
             * @param {string} section  Name of the content we request to set in the windows body.
             */
            setSection: function(section) {
                self.windows().removeContentClass();
                self.build().sectionOptions(self.res.sections[self.indexes.sections[section]]['id']);
            },

            /**
             * Select the requested content.
             *
             * @param section
             */
            selectSection: function(section) {
                self._HTMLElement.windows.querySelectorAll('#menu div').forEach(function(button) {
                    button.classList.remove('active');
                });
                let lastSection = self._HTMLElement.windows.querySelector(`#${section}`);

                if(lastSection) {
                    lastSection.classList.add('active');
                    self.ls().set('section', section);
                    self.windows().setTitle(self.texts[section]);
                    self.windows().setSection(section);
                }
            },

            /**
             * Select the appropriate content depending of the requested options.
             *
             * @param option
             */
            selectOption: function(option) {
                self._HTMLElement.windows.classList.add('content');

                let content = self.windows().getContent();
                let contentType = self.res.contentTypes[self.indexes.contentTypes[option.content_type]];

                content.innerHTML = '';
                content.classList.clear();

                switch (contentType.type.toLowerCase()) {
                    case 'plugin':
                        let plugin = self.res.plugins[self.indexes.contentPlugins[option.id]].name;
                        content.classList.add(plugin);
                        self.plugins.plugins[plugin].run();
                        break;
                }
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

