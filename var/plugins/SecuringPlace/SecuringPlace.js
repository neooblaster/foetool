function SecuringPlace (parent) {
    // ------------------------------------------------------------------- //
    //                  Plugin Header - DO NOT MODIFY                      //
    // ------------------------------------------------------------------- //
    /**
     * @type {SecuringPlace} Refering to itself to simplify binding.
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
    self.version = "0.1.0";

    /**
     * @type {Array} self.stylesheets  You stylesheet path located in root folder of the plugin.
     * Possible value for "type" : css, less
     */
    self.stylesheets = [
        {sheet: "SecuringPlace", type: "less"}
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
     * files Plugin.text.[<language>].json for existing text keys once executed in FoeTool
     */
    self.alltexts = {
        "fr-FR": {
            "LEVEL_COST": "Coût du niveau",
            "CONTRIB_SUM": "Somme des dépôts actuels",
            "CURRENT_CONTRIB": "Votre participation actuelle",
            "ADVERSARY_CONTRIB": "Participation du joueur à dépasser",
            "ARCH_BONUS": "Bonus de votre Arche",
            "REWARD": "Récompense (PF) de la place visée",
            "UNLOCKABLE": "Vous ne pouvez pas bloquer la place",
            "LEFT_TO_UP": "Nombre de PF restant pour compléter le niveau",
            "REQUIRE_TO_LOCK": "PFs que vous devez ajouter pour bloquer la place",
            "TOTAL_CONTRIB": "Contribution Total",
            "PROFIT": "Profit",
            "UP": "▲",
            "DOWN": "▼"
        }
    };

    /**
     * @type {null} DO NOT MODIFY THIS LINE BUT USE THIS PROPERTY IN YOUR CODE.
     */
    self.texts = self.alltexts[self.defaultLanguage];

    self.data = null;

    self._HTMLElement = {
        result: null
    };

    /**
     * Input to build with ID. This order will be the order on the screen.
     * @type {[string,string,string,string,string,string]}
     */
    self.inputs = [
        'LEVEL_COST', 'CONTRIB_SUM',
        'CURRENT_CONTRIB', 'ADVERSARY_CONTRIB',
        'ARCH_BONUS', 'REWARD'
    ];



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
    };

    /**
     * Implement your instructions when the plugin is called to appears in the windows.
     */
    self.run = function() {
        self.inputs.map(function(input) {
            self.host.appendChild(self.build().input(self.texts[input], input, self.data[input]));
        });
        self.host.appendChild(self.build().result());
        self.calc();
    };



    // ------------------------------------------------------------------- //
    //                        Plugin Implementation                        //
    // ------------------------------------------------------------------- //
    self.build = function() {
        return {
            input: function(label, id, value = 0) {
                let entry = {
                    classList: ['inputEntry'], attributes: {id: id},
                    children: [
                        {name: "label", properties: {textContent: label}},
                        {
                            name: "input", attributes: {type: "number", min: "0"}, properties: {
                                value: value,
                                onchange: self.calc
                            }
                        }
                    ]
                };

                return new self.parent.HTML().compose(entry);
            },

            result: function() {
                let result = {
                    classList: ['resultField']
                };

                self._HTMLElement.result = self.parent.HTML().compose(result);

                return self._HTMLElement.result;
            },

            message: function() {
                return {
                    leftToLevelUp: function(left) {
                        let leftToLevelUpMsg = {
                            classList: ['inputEntry'],
                            children: [
                                {name: 'label', properties: {textContent: self.texts.LEFT_TO_UP}},
                                {name: 'span', properties: {textContent: left}}
                            ]
                        };

                        return self.parent.HTML().compose(leftToLevelUpMsg);
                    },

                    unlockable: function() {
                        let unloackableMsg = {
                            classList: ['inputEntry'],
                            children: [
                                {name: 'label', properties: {textContent: self.texts.UNLOCKABLE}}
                            ]
                        };

                        return self.parent.HTML().compose(unloackableMsg);
                    },

                    addToLock: function(toAdd) {
                        let addToLockMsg = {
                            classList: ['inputEntry'],
                            children: [
                                {name: 'label', properties: {textContent: self.texts.REQUIRE_TO_LOCK}},
                                {name: 'span', properties: {textContent: toAdd}}
                            ]
                        };

                        return self.parent.HTML().compose(addToLockMsg);
                    },

                    totalToLock: function(total) {
                        let totalToLockMsg = {
                            classList: ['inputEntry'],
                            children: [
                                {name: 'label', properties: {textContent: self.texts.TOTAL_CONTRIB}},
                                {name: 'span', properties: {textContent: total}}
                            ]
                        };

                        return self.parent.HTML().compose(totalToLockMsg);
                    },

                    profit: function(profit) {
                        let profitMsg = {
                            classList: ['inputEntry'],
                            children: [
                                {name: 'label', properties: {textContent: self.texts.PROFIT}},
                                {name: 'span', properties: {textContent: profit}}
                            ]
                        };

                        return self.parent.HTML().compose(profitMsg);
                    }
                };
            }
        };
    };

    self.index = function() {

    };

    self.load = function() {
        let data = parent.ls().get('SecuringPlace');
        if (data) self.data = JSON.parse(data);
        if (!data) {
            self.data = {};
            self.inputs.map(function(input) {
                self.data[input] = 0;
            });
        }
    };

    self.save = function() {
        parent.ls().set('SecuringPlace', JSON.stringify(self.data));
    };

    self.calc = function() {
        self.inputs.map(function(input) {
            self.data[input] = parseInt(self.host.querySelector(`div.inputEntry#${input} input`).value);
        });
        self.save();

        // console.log(self.data);

        let leftToLevelUp = self.data['LEVEL_COST'] - self.data['CONTRIB_SUM'];
        let toEqualize = self.data['ADVERSARY_CONTRIB'] - self.data['CURRENT_CONTRIB'];
        let remainAfterEqualization = leftToLevelUp - toEqualize;
        let needToLock = Math.ceil(remainAfterEqualization / 2);
        let contribTotal = toEqualize + needToLock;
        let contribToAdd = contribTotal - self.data['CURRENT_CONTRIB'];
        let reward = Math.round(self.data['REWARD'] * (1 + (self.data['ARCH_BONUS'] / 100)));
        let profit = reward - contribTotal;

        // console.log('Reste', leftToLevelUp);
        // console.log('Pour égaliser', toEqualize);
        // console.log('Reste après égalisation', remainAfterEqualization);
        // console.log('Require pour lock', needToLock);
        // console.log('Contrib Total', contribTotal);
        // console.log('Soit a ajouter', contribToAdd);
        // console.log('Recompense', reward);
        // console.log('Profit', profit);

        let resultHost = self._HTMLElement.result;

        resultHost.innerHTML = '';
        resultHost.appendChild(self.build().message().leftToLevelUp(leftToLevelUp));

        if (
            needToLock <= 0
        ) {
            resultHost.appendChild(self.build().message().unlockable());
        } else {
            resultHost.appendChild(self.build().message().addToLock(contribToAdd));
            resultHost.appendChild(self.build().message().totalToLock(contribTotal));
            resultHost.appendChild(self.build().message().profit(profit));
        }
    };


    return self
}