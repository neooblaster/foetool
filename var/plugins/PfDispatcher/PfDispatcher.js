function PfDispatcher (parent) {
    // ------------------------------------------------------------------- //
    //                  Plugin Header - DO NOT MODIFY                      //
    // ------------------------------------------------------------------- //
    /**
     * @type {PfDispatcher} Refering to itself to simplify binding.
     */
    let self = this;

    /**
     * @type {FOETool} self.parent  Refering to the main engine.
     */
    self.parent = parent;

    /**
     * @type {*|Element} self.host  Windows Content Host initialized by the parent.
     */
    self.host = null;



    // ------------------------------------------------------------------- //
    //                          Plugin Settings                            //
    // ------------------------------------------------------------------- //
    /**
     * @type {string} Version of the plugin.
     */
    self.version = "0.1.2";

    /**
     * @type {Array} self.stylesheets  You stylesheet path located in root folder of the plugin.
     * Possible value for "type" : css, less
     */
    self.stylesheets = [
        {sheet: "PfDispatcher", type: "less"}
    ];

    /**
     * @type {string} The default language of the plugin.
     * File Plugin.text.json will overload this language.
     */
    self.defaultLanguage = "fr-FR";

    /**
     * @type {Array} Declare here you known <language> to automatically load file name
     * Plugin.text.<language>.json
     */
    self.languages = ["en-EN"];

    /**
     * @type {{}} self.alltexts  Enter your texts here by languages. It Will be overload by
     * files Plugin.text.[<language>].json for existing text keys
     */
    self.alltexts = {
        "fr-FR": {
            "LABEL": "Label",
            "DEDPART": "Part Dédiée",
            "SPENTPART": "Part Dépensée <br />Excès(+), Manquant(-)",
            "SPENT": "Dépensés",
            "PFS": "pfs"
        }
    };

    /**
     * @type {null} DO NOT MODIFY THIS LINE BUT USE THIS PROPERTY IN YOUR CODE.
     */
    self.texts = self.alltexts[self.defaultLanguage];



    // ------------------------------------------------------------------- //
    //                      Plugin Mandatory Methods                       //
    // ------------------------------------------------------------------- //
    /**
     * Implement your init instructions.
     * This method is called once the plugin is loaded.
     */
    self.init = function() {
        self.load();
        self.index();
        self.calc().totalSpent();
        self.calc().totalParts();
    };

    /**
     * Implement your instructions when the plugin is called to appears in the windows.
     */
    self.run = function() {
        self.refresh().table();
    };



    // ------------------------------------------------------------------- //
    //                        Plugin Implementation                        //
    // ------------------------------------------------------------------- //
    /**
     * @type {{inputs: Array}} Plugin Data.
     */
    self.data = {
        inputs: []
    };

    /**
     * @type {{host: null, table: null}} Refering HTML Elements to reuse them.
     * @private
     */
    self._HTMLElement = {
        host: null,
        table: null
    };

    /**
     * @type {{lastIndex: number, idIndex: Array}}  Index of data.
     */
    self.indexes = {
        lastIndex: 0,
        idIndex: []
    };

    /**
     * @type {number}  Total Forge Point spent.
     */
    self.totalSpent = 0;

    /**
     * @type {number} Total Percent parts dispatched.
     */
    self.totalParts = 0;


    /**
     * Function Group of builder of HTML Elements.
     *
     * @returns {{table: table, input: input}}
     */
    self.build = function() {
        return {
            /**
             * Build and append the table to the host windows.
             */
            table: function() {
                self._HTMLElement.table = new parent.HTML().compose({
                    name: "table", children: [
                        {
                            name: "tr", children: [
                            {name: "th", properties: {textContent: "+", onclick: self.input().add}},
                            {name: "th", properties: {textContent: self.texts.LABEL}},
                            {name: "th", properties: {textContent: self.texts.DEDPART}},
                            {name: "th", properties: {innerHTML: self.texts.SPENTPART}},
                            {name: "th", properties: {textContent: self.texts.SPENT}}
                        ]
                        }
                    ]
                });
                self.host.appendChild(self._HTMLElement.table);
            },

            /**
             * Build en input entry in the table.
             *
             * @param input
             * @param append
             * @returns {*}
             */
            input: function(input, append = true) {
                let id = input.id;
                let label = input.label;
                let part = input.part;
                let spent = input.spent;
                let spentPart = self.calc().spentPart(part, spent);
                let delta = self.calc().delta(part, spent);

                let row = new parent.HTML().compose({
                    name: "tr", attributes: {id: `row${id}`}, children: [
                        {
                            name: "td", classList: ['id'], properties: {textContent: "-", onclick: self.input(id).remove}
                        },
                        {
                            name: "td", classList: ['label'], children: [
                            {
                                name: "input",
                                properties: {
                                    value: label,
                                    onchange: function() {
                                        self.input(id).update().label(this.value);
                                    }
                                }
                            }
                        ]
                        },
                        {
                            name: "td", classList: ['part'], children: [
                            {
                                name: "input",
                                attributes: {type: "number", min: 0, max: 100},
                                properties: {
                                    value: part,
                                    onchange: function() {
                                        self.input(id).update().part(this.value);
                                    }
                                }
                            }
                        ]
                        },
                        {
                            name: "td", classList: ['spentPart'], properties: {textContent: `${spentPart}% (${delta}pfs)`}
                        },
                        {
                            name: "td", classList: ['spent'], children: [
                            {
                                name: "input", attributes: {type: "number", value: spent, min: 0, max: 999999},
                                properties: {
                                    value: spent,
                                    onchange: function() {
                                        self.input(id).update().spent(this.value);
                                    }
                                }
                            }
                        ]
                        },
                    ]
                });

                if (append) self._HTMLElement.table.append(row);
                return row;
            }
        };
    };

    /**
     * Function Group of calculations.
     *
     * @returns {{totalSpent: totalSpent, spentPart: spentPart, delta: delta}}
     */
    self.calc = function() {
        return {
            /**
             * Calculate the total percent parts (goal is to have 100%)
             */
            totalParts: function() {
                self.totalParts = 0;
                self.data.inputs.map(function(input) {
                    self.totalParts += input.part;
                });
            },

            /**
             * Calculate the total Forge Point spent.
             */
            totalSpent: function() {
                self.totalSpent = 0;
                self.data.inputs.map(function(input) {
                    self.totalSpent += input.spent;
                });
            },

            /**
             * Calculate the pourcentage of Forge Point spent.
             * @param part
             * @param spent
             * @returns {number}
             */
            spentPart: function(part, spent) {
                if (spent) {
                    return Math.round((spent / self.totalSpent) * 10000) / 100;
                } else {
                    return 0;
                }
            },

            /**
             * Calculate the excedeed/missing amout of Forge Point for the entry.
             * @param part
             * @param spent
             * @returns {number}
             */
            delta: function(part, spent) {
                let spentPart = self.calc().spentPart(part, spent);
                let delta = ((part - spentPart) / 100) * self.totalSpent;

                return -1 * (Math.round(delta * 10) / 10);
            }
        }
    };

    /**
     * Perform indexation of data.
     */
    self.index = function() {
        let lastIndex = 0;
        let index = 0;
        self.indexes.idIndex = [];

        self.data.inputs.map(function(input) {
            if (input.id > lastIndex) lastIndex = input.id;
            self.indexes.idIndex[input.id] = index;
            index++;
        });
        self.indexes.lastIndex = lastIndex;
    };

    /**
     * Function Group to manipulate input entries of the table.
     *
     * @param id
     * @returns {{add: add, remove: remove, update: update}}
     */
    self.input = function(id) {
        return {
            /**
             * Add a new entry in the table.
             */
            add: function() {
                let id = self.indexes.lastIndex + 1;
                let input = {
                    "id": id,
                    "label": "label",
                    "part": 0,
                    "spent": 0
                };

                self.build().input(input);

                self.data.inputs.push(input);
                self.index();
                self.save();
                self.indexes.lastIndex = id;
            },

            /**
             * Remove the selected entry
             */
            remove: function() {
                let row = self._HTMLElement.table.querySelector(`tr#row${id}`);
                row.parentNode.removeChild(row);

                let inputs = [];
                self.data.inputs.map(function(input) {
                    if (input.id !== id) {
                        inputs.push(input);
                    }
                });
                self.data.inputs = inputs;
                self.index();
                self.save();
                self.refresh().inputs();
            },

            /**
             * Methods to update a specific cell in the entry.
             *
             * @returns {{label: label, part: part, spent: spent, data: data}}
             */
            update: function() {
                let index = self.indexes.idIndex[id];

                return {
                    label: function(label) {
                        self.input(id).update().data('label', label);
                    },

                    part: function(part) {
                        self.input(id).update().data('part', parseInt(part));
                    },

                    spent: function(spent) {
                        self.input(id).update().data('spent', parseInt(spent));
                    },

                    data: function(field, value) {
                        // console.log(field, value, index);
                        self.data.inputs[index][field] = value;
                        self.save();
                        self.refresh().inputs();
                    }
                }
            }
        }
    };

    /**
     * Load saved data for this plugin.
     */
    self.load = function() {
        let data = parent.ls().get('PfDispatcher');
        if (data) self.data = JSON.parse(data);
    };

    /**
     * Function Group to set/update (refresh) table and its input entries.
     *
     * @returns {{table: table, inputs: inputs}}
     */
    self.refresh = function() {
        return {
            /**
             * Request the building of the table and its input entries.
             */
            table: function() {
                self.host.innerHTML = '';
                self.build().table();
                self.data.inputs.map(function(input) {
                    self.build().input(input);
                });
                self.refresh().headers();
            },

            /**
             * Update the calculated cell.
             */
            inputs: function() {
                self.refresh().headers();

                self.data.inputs.map(function(input) {
                    let id = input.id;
                    let part = input.part;
                    let spent = input.spent;
                    let spentPart = self.calc().spentPart(part, spent);
                    let delta = self.calc().delta(part, spent);

                    let row  = self._HTMLElement.table.querySelector(`tr#row${id}`);
                    row.querySelector('.spentPart').textContent = `${spentPart}% (${delta}pfs)`;
                })
            },

            /**
             * Update values in the table header cells.
             */
            headers: function() {
                self.calc().totalSpent();
                self.calc().totalParts();

                self._HTMLElement.table.querySelector('tr:first-child th:last-child').textContent = `${self.texts.SPENT} ${self.totalSpent} ${self.texts.PFS}`;
                self._HTMLElement.table.querySelector('tr:first-child th:nth-child(3)').textContent = `${self.texts.SPENT} (${self.totalParts}%)`;
            }
        }
    };

    /**
     * Save the plugin data.
     */
    self.save = function() {
        parent.ls().set('PfDispatcher', JSON.stringify(self.data));
    };



    return self
}