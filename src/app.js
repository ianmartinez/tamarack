/*  Handles views managing toolbars, menus, and icons */

/**
 * An enum representing the labout of
 * the text and icon in a TkLabel.
 * @enum {String}
 */
const TkToolbarButtonLayout = {
    ICON_TOP: "tktoolbar-icon-top",
    ICON_BOTTOM: "tktoolbar-icon-bottom",
    ICON_LEFT: "tktoolbar-icon-left",
    ICON_RIGHT: "tktoolbar-icon-right",
    ICON_ONLY: "tktoolbar-icon-only",
    TEXT_ONLY: "tktoolbar-text-only",
};

class TkToolbar extends TkStack {

    constructor(options = {}) {
        options.direction = options.direction ?? TkStackDirection.FLOW;
        super(options);
        this.addViewName("tktoolbar");
        this.buttonLayout = options.layout ?? TkToolbarButtonLayout.ICON_TOP;
    }
    
    /**
     * The layout of the TkButtons on the toolbar.
     * @type {TkToolbarButtonLayout}
     */
    get buttonLayout() {
        return this.getAttributeFromEnum(TkToolbarButtonLayout, TkToolbarButtonLayout.ICON_TOP);
    }

    set buttonLayout(value) {
        this.addAttributeFromEnum(TkToolbarButtonLayout, value);
    }

}

/**
 * A simple wrapper to make using Ionicons (https://ionicons.com/) 
 * with tamarack easy. Note: use need to include the Ionicons script
 * to use TkIcon.
 */
class TkIcon extends TkView {

    /**
     * Create a new <ion-icon> element backed by a TkView.
     * 
     * @param {Any} options Same as TkView, minus the tag option.
     * @param {String} name The name of the Ionicon.
     */
    constructor(options = {}) {
        // Add name to attributes option
        if(options.attributes === undefined)
            options.attributes = {};
        options.attributes.name = options.name;

        // Send it to the TkView constructor
        super(options, { tag: "ion-icon" });

        // Add the view name TkIcon
        this.addViewName("tkicon");
    }

}