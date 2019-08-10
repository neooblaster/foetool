function FOETool(){
    let self = this;

    // Internal Settings
    self.settings = {
        path: {
            resource: "https://foe.neoblaster.fr/iface/getResources.php"
        }
    };

    // Integrating Libs
    self.HTML = HTML;
    self.xhrQuery = xhrQuery;

    // Referencing HTMLElements
    self._HTMLElement = {
        openButton: null,
        windows: null
    };

    self.res = null;
    self.indexes = {
        images: {}
    };

    self.waiting = null;



    self.build = function() {
        return {
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

            windows: function() {
                self._HTMLElement.windows = new self.HTML().compose({
                    attributes: {id: "FOETWindows", hidden: ''}, children: [
                        {
                            children: [
                                {name: "h1", properties: {textContent: "FoE Tool"}},
                                {}
                            ]
                        }
                    ]
                })
            }
        };
    };

    self.windows = function() {
        return {
            open: function() {
                self._HTMLElement.windows.removeAttribute('hidden');
            },

            close: function() {
                self._HTMLElement.windows.setAttribute('hidden', '');
            },

            toggle: function() {
                self._HTMLElement.windows.hasAttribute('hidden') ? self.windows().open() : self.windows().close();
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
        let xhr = new self.xhrQuery();
        xhr.target(self.settings.path.resource);
        xhr.callbacks(function(response) {
            try {
                response = JSON.parse(response);
                this.res = response;
            } catch (err) {
                console.error("FOETool.init(), XHR responses failed on", response, err);
            }
        }.bind(self));
        xhr.send();

        // Wait for XHR answers
        self.waiting = setInterval(function() {
            if (self.res) {
                // Indexation
                self.index().images();

                // Build Button
                self.build().openButton();
                self.build().windows();

                // Appending HTMLElement
                document.body.appendChild(self._HTMLElement.openButton);
                document.body.appendChild(self._HTMLElement.windows);

                clearInterval(self.waiting);
            }
        }, 100);
    };

    /**
     * Returning self for making successive calls
     */
    return self;
}

