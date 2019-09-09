function Template (parent) {
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
    self.version = "0.1.0";

    /**
     * @type {Array} self.stylesheets  You stylesheet path located in root folder of the plugin.
     * Possible value for "type" : css, less
     */
    self.stylesheets = [
        {sheet: "Template", type: "less"}
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
            "TEXT_KEY": "You Text here"
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
    };

    /**
     * Implement your instructions when the plugin is called to appears in the windows.
     */
    self.run = function() {
    };



    // ------------------------------------------------------------------- //
    //                        Plugin Implementation                        //
    // ------------------------------------------------------------------- //



    return self
}