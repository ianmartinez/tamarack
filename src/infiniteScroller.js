/**
 * Requires: 
 *  tamarack/core
 *  tamarack/widgets
 */

/**
 * A simple infinite scroller.
 */
class TkInfiniteScroller extends TkWidget {

    constructor(options = {}) {
        // Set placeholder
        this._placeholderWidget = null;        
        if (options.placeholder !== undefined) {
            this.placeholder = options.placeholder;
        }

        // Set the render item callback
        this._renderItemCallback = options.renderItem ?? (() => {});

        // Set the fetch callback
        this._fetchCallback = options.fetch ?? (() => {});
    }

    /**
     * The placeholder to show in place of content
     * that is being loaded.
     * @type {...String|HTMLElement|TkWidget}
     */
    get placeholder() {
        return this._placeholderWidget;
    }

    set placeholder(value) {
        if (TkObject.is(value, TkWidget)) { // TkWidget
            this._placeholderWidget = value;
        } else (TkObject.is(value, String)) { // Selector or HTMLElement
            this._placeholderWidget = new TkWidget({ from: value });
        }
    }

    /**
     * A callback for when an item is recieved after a fetch() is done.
     * It is passed the item that was fetched as the first parameter and
     * a widget to render it into. Return the rendered widget.
     * @type {function(Any, TkWidget):TkWidget} 
     */
    get renderItem() {
        return this._renderItemCallback;
    }

    set renderItem(value) {
        this._renderItemCallback = value;
    }

    /**
     * A callback to fetch a number of items from the
     * data source. Returns a promise.
     * 
     * @type {function(Number):Promise} 
     */
    get fetch() {
        return this._fetchCallback;
    }

    set fetch(value) {
        this._fetchCallback = value;
    }

}