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
        openButton: null
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
                    children: [{
                        classList: ['InnerBorder1'], children: [{
                            classList: ['InnerBorder2'], children: [{name: 'img', attributes:{src: imagePath}}]
                        }]
                    }]
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

                // Appending HTMLElement
                document.body.appendChild(self._HTMLElement.openButton);

                clearInterval(self.waiting);
            }
        }, 100);
    };

    /**
     * Returning self for making successive calls
     */
    return self;
}

