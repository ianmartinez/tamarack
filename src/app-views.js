class TkToolbar extends TkStack {

    constructor(options = {}) {
        options.direction = options.direction ?? TkStackDirection.HORIZONTAL;
        super(options);
        this.addViewName("tktoolbar");
        this.buttonLayout = options.layout ?? TkLabelLayout.ICON_TOP;
    }

    /**
     * The layout of the TkButtons on the toolbar.
     * @type {TkLabelLayout}
     */
    get buttonLayout() {
        return this.getAttributeFromEnum(TkLabelLayout, TkLabelLayout.ICON_TOP);
    }

    set buttonLayout(value) {
        this.addAttributeFromEnum(TkLabelLayout, value);
    }

}

/**
 * A simple wrapper to make using Ionicons (https://ionicons.com/) 
 * with tamarack easier. Note: You need to include Ionicons
 * to use TkIcon.
 */
class TkIcon extends TkView {

    /**
     * Create a new <ion-icon> element backed by a TkView.
     * 
     * @param {Object} options Same as TkView, minus the tag option.
     * @param {String} options.name The name of the Ionicon.
     */
    constructor(options = {}) {
        // Add name to attributes option
        if (options.attributes === undefined)
            options.attributes = {};
        options.attributes.name = options.name;

        // Send it to the TkView constructor
        super(options, { tag: "ion-icon" });

        // Add the view name TkIcon
        this.addViewName("tkicon");
    }

}

/* TODO */
class TkMenuBar extends TkView {

}

/* TODO */
class TkMenu extends TkView {

}

class TkSidebar extends TkView {

    constructor(options = {}) {
        super(options);
        this.addViewName("tksidebar");
        this.autoCollapse = options.autoCollapse ?? true;
        if (options.at === TkSidebarPosition.START)
            this.moveToTop();
        else if (options.at === TkSidebarPosition.END)
            this.moveToBottom();
    }

    get collapse() {
        return this.visible;
    }

    set collapse(value) {
        this.visible = value;
    }

    get autoCollapse() {
        return this.hasClass("tksidebar-autocollapse");
    }

    set autoCollapse(value) {
        return this.classIf(value, "tksidebar-autocollapse");
    }

}

/**
 * Enum representing where the TkSidebar should be moved to.
 */
const TkSidebarPosition = {
    AUTO: 0, // Don't move
    START: 1, // Move to start
    END: 2 // Move to end
};