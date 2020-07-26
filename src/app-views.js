class TkToolbar extends TkStack {

    constructor(options = {}) {
        options.direction = options.direction ?? TkStackDirection.HORIZONTAL;
        super(options);
        this.addViewName("tktoolbar");
        this.buttonLayout = options.layout ?? TkLabelLayout.ICON_TOP;
    }

    
    /**
     * Add child items to this view. The child items can be
     * other TkViews, HTMLElements, or CSS selectors representing
     * HTMLElements.
     * 
     * @param  {...String|HTMLElement|TkView} items The items to add.
     */
    add(...items) {
        for(let item of items) {
            let view = TkView.viewFrom(item);

            // Remove autostyle from buttons
            if(view.autoStyled)
                view.removeClass(TkButtonStyle.NORMAL);

            super.add(view);
        }
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

/**
 * A view that displays on the left side of an app and automatically collapses when
 * the window is too small (i.e. on mobile) and can be opened and closed by gestures,
 * or manually via the "overlay" property. 
 * 
 * The parent should be set as TkAppContentOuterView and only one should be
 * created per app.
 * 
 * Note: In order to support gestures, such as swiping to close the sidebar
 * overlay, include Hammer.JS (https://hammerjs.github.io/).
 * 
 * TODO: Add gesture to show.
 */
class TkSidebar extends TkView {

    /**
     * Create a new TkSidebar.
     * 
     * @param {Object} options Same as TkView.
     * @param {Boolean} [options.useGestures=true] If the sidebar can be shown and
     * hidden with gestures.
     */
    constructor(options = {}) {
        super(options);
        this.addViewName("tksidebar");
        this.content = new TkView({ parent: this });
        this.content.addViewName("tksidebar-content");

        let sidebar = this;
        document.addEventListener("click", (event) => {
            // Hide the sidebar if there was a click and 
            // and the sidebar is an overlay
            if (!sidebar.e.contains(event.target) && sidebar.hasClass("tksidebar-overlay")) {
                sidebar.overlay = false;
            }
        });

        // If Hammer.JS detected, use it to support gestures
        if (typeof Hammer !== "undefined" && (options.useGestures !== false)) {
            // Allow the sidebar overlay to be swiped away 
            let gestureRecognizer = this.gestureRecognizer();
            gestureRecognizer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
            gestureRecognizer.on("panleft", (event) => {
                // For some reason hammer's panleft still fires even if panning vertcally (to scroll) 
                if (Math.abs(event.deltaY) > Math.abs(event.deltaX))
                    return false;

                sidebar.overlay = false;
            });
        }
    }

    /**
     * If the sidebar overlay is visible.
     * 
     * Note: In order to set this property correctly in
     * a click event handler, you *have* to call event.stopPropagation()
     * or the click event will propagate to the sidebar's internal handler
     * to automatically close the sidebar overlay when a click is
     * detected outside of it, which will override whatever value you set.
     * @type {Boolean}
     */
    get overlay() {
        return this.hasClass("tksidebar-overlay");
    }

    set overlay(value) {
        this.classIf(value, "tksidebar-overlay");
    }

}