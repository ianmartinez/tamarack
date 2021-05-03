/**
 * Requires: 
 *  tamarack/core
 *  tamarack/views
 */

/**
 * A simple infinite scroll view.
 * 
 * Infinite scrolling is something that appears in virtually every website
 * nowadays, but it's actually quite a chore to implement. This class simplifies
 * it into a simple TkView that you can extend for just about anything that requires
 * such functionality.
 * 
 * All you need to use it is specify 3 things:
 *  - placeholder: The item that will put in the place of an item that is currently loading.
 *  - fetch: A callback to fetch a set of items when TkInfiniteScroll needs them. Use
 *  this for Ajax calls.
 *  - renderItem: A callback to render an item once it has been fetched (i.e. when the Ajax call
 *  returns). 
 * 
 * Adapted from https://developers.google.com/web/updates/2016/07/infinite-scroller to
 * work cleanly within tamarack and add additional functionality, such as relative positioning
 * and use ES6 classes instead of pre-ES6 Object.prototype.someNonsense = ...
 */
class TkInfiniteScroll extends TkView {

    constructor(options = {}) {
        super(options);
        this.addAttribute("tkinfinitescroll");

        // Actual scroll plane
        this.scrollplane = new TkView({
            parent: this,
            attributes: { "tkinfinitescroll-scrollplane": null }
        });

        // Internal panel to force scroller to scroll to
        this._runway = new TkView({
            parent: this.scrollplane,
            attributes: { "tkinfinitescroll-runway": null }
        });

        this.scrollPos = 0;

        // Internal variables
        this._anchorItem = { index: 0, offset: 0 };
        this._firstAttachedItem = 0;
        this._lastAttachedItem = 0;
        this._placeholderHeight = 0;
        this._placeholderWidth = 0;
        this._cachedItems = [];
        this._loadedItems = 0;
        this._requestInProgress = false;
        this._placeholders = [];
        this._anchorScrollTop = 0;
        // Number of items to instantiate beyond current view in the scroll direction
        this._runwayItems = options.runwayItems ?? 50;
        // Number of items to instantiate beyond current view in the opposite direction
        this._runwayItemsOpposite = options.runwayItemsOpposite ?? 10;
        // The number of pixels of additional length to allow scrolling to.
        this._runwayExtraLength = options.runwayExtraLength ?? 800;
        this._runwayEnd = 0;

        // Set placeholder
        this._placeholderView = null;
        if (options.placeholder !== undefined) {
            this.placeholder = options.placeholder;
        } 

        // Set template
        this._templateView = null;
        if (options.template !== undefined) {
            this.template = options.template;
        }

        // Set the render item callback
        this._renderItemCallback = options.renderItem ?? (() => { });

        // Set the fetch callback
        this._fetchCallback = options.fetch ?? (() => { });

        this.scrollplane.on("scroll", this.onScroll.bind(this));
        this._resizeListener = this.onResize.bind(this);
        window.addEventListener("resize", this._resizeListener);

        // Start loading content when the document is ready
        this._loadedListener = (() => {
            // Trigger initial load
            this.onResize();
        }).bind(this);

        TkDocument.whenLoaded(this._loadedListener);
    }

    clonePlaceholder() {
        return new TkView({ from: this._placeholderView.e.cloneNode(true) });
    }

    delete() {
        document.removeEventListener("DOMContentLoaded", this._loadedListener);
        window.removeEventListener("resize", this._resizeListener);
        super.delete();
    }

    /**
     * Number of items to instantiate beyond current 
     * view in the scroll direction.
     * 
     * @type {Number}
     */
    get runwayItems() {
        return this._runwayItems;
    }

    set runwayItems(value) {
        this._runwayItems = value;
    }

    /**
     * Number of items to instantiate beyond current 
     * view in the opposite direction.
     * 
     * @type {Number}
     */
    get runwayItemsOpposite() {
        return this._runwayItemsOpposite;
    }

    set runwayItemsOpposite(value) {
        this._runwayItemsOpposite = value;
    }

    /**
     * The number of pixels of additional length to allow scrolling to.
     * 
     * @type {Number}
     */
    get runwayExtraLength() {
        return this._runwayExtraLength;
    }

    set runwayExtraLength(value) {
        this._runwayExtraLength = value;
    }

    /**
     * The placeholder to show in place of content
     * that is being loaded.
     * @type {...String|HTMLElement|TkView}
     */
    get placeholder() {
        // Try to get an existing placeholder
        let existingPlaceholder = this._placeholders.pop();

        if (existingPlaceholder) {
            existingPlaceholder.removeAttribute("tk-hide");
            return existingPlaceholder;
        }

        // If there is no existing one, create a clone
        return this.clonePlaceholder();
    }

    set placeholder(value) {
        if (TkObject.is(value, TkView)) { // TkView
            this._placeholderView = value;
        } else { // Selector or HTMLElement
            this._placeholderView = new TkView({ from: value });
        }

        // Reset placeholders
        this._placeholders = [];

        // Add placeholder attribute
        this._placeholderView.addAttribute("tkplaceholder");
    }

    /**
     * Refresh the bounds of the view to respond to the
     * window being resized.
     */
    onResize() {
        // Add placeholder clone to scroller
        let placeholder = this.clonePlaceholder();
        placeholder.style.position = "absolute";
        placeholder.removeAttribute("tk-hide");
        this.scrollplane.add(placeholder);

        // Re-measure placeholder clone
        this._placeholderHeight = placeholder.e.offsetHeight;
        this._placeholderWidth = placeholder.e.offsetWidth;

        // Remove placeholder clone
        this.scrollplane.remove(placeholder);

        // Reset dimensions of cached items
        for (let item of this._cachedItems) {
            item.height = 0;
            item.width = 0;
        }

        // Trigger the scroll refresh
        this.onScroll();
    }

    onScroll() {
        this.scrollPos = this.scrollplane.e.scrollTop;

        let delta = this.scrollplane.e.scrollTop - this._anchorScrollTop;
        // Special case, if we get to very top, always scroll to top.
        if (this.scrollplane.e.scrollTop == 0) {
            this._anchorItem = { index: 0, offset: 0 };
        } else {
            this._anchorItem = this.calculateAnchoredItem(this._anchorItem, delta);
        }

        this._anchorScrollTop = this.scrollplane.e.scrollTop;
        let lastScreenItem = this.calculateAnchoredItem(this._anchorItem, this.scrollplane.e.offsetHeight);
        if (delta < 0)
            this.fill(this._anchorItem.index - this._runwayItems, lastScreenItem.index + this._runwayItemsOpposite);
        else
            this.fill(this._anchorItem.index - this._runwayItemsOpposite, lastScreenItem.index + this._runwayItems);
    }

    /**
     * Calculates the item that should be anchored after scrolling by delta from
     * the initial anchored item.
     * 
     * @param {{index: Number, offset: Number}} initialAnchor The initial position
     *     to scroll from before calculating the new anchor position.
     * @param {Number} delta The offset from the initial item to scroll by.
     * 
     * @return {{index: Number, offset: Number}} Returns the new item and offset
     *     scroll should be anchored to.
     */
    calculateAnchoredItem(initialAnchor, delta) {
        if (delta == 0)
            return initialAnchor;

        delta += initialAnchor.offset;
        let i = initialAnchor.index;
        let placeholders = 0;

        if (delta < 0) {
            while (delta < 0 && i > 0 && this._cachedItems[i - 1].height) {
                delta += this._cachedItems[i - 1].height;
                i--;
            }
            placeholders = Math.max(-i, Math.ceil(Math.min(delta, 0) / this._placeholderHeight));
        } else {
            while (delta > 0 && i < this._cachedItems.length && this._cachedItems[i].height && this._cachedItems[i].height < delta) {
                delta -= this._cachedItems[i].height;
                i++;
            }
            if (i >= this._cachedItems.length || !this._cachedItems[i].height)
                placeholders = Math.floor(Math.max(delta, 0) / this._placeholderHeight);
        }

        i += placeholders;
        delta -= placeholders * this._placeholderHeight;

        return {
            index: i,
            offset: delta,
        };
    }

    /**
     * Sets the range of items which should be attached and attaches those items.
     * 
     * @param {Number} start The first item which should be attached.
     * @param {Number} end One past the last item which should be attached.
     */
    fill(start, end) {
        this._firstAttachedItem = Math.max(0, start);
        this._lastAttachedItem = end;
        this.attachContent();
    }

    /**
     * Attaches content to the scroller and updates the scroll position if
     * necessary.
     */
    attachContent() {
        let i;
        let unusedViews = [];
        for (i = 0; i < this._cachedItems.length; i++) {
            // Skip the items which should be visible.
            if (i == this._firstAttachedItem) {
                i = this._lastAttachedItem - 1;
                continue;
            }

            if (this._cachedItems[i].view) {
                if (this._cachedItems[i].view.hasAttribute("tkplaceholder")) {
                    this._placeholders.push(this._cachedItems[i].view);
                    this._placeholders[this._placeholders.length - 1].addAttribute("tk-hide");
                } else {
                    unusedViews.push(this._cachedItems[i].view);
                }
            }
            this._cachedItems[i].view = null;
        }

        // Create views
        for (i = this._firstAttachedItem; i < this._lastAttachedItem; i++) {
            while (this._cachedItems.length <= i)
                this.addItem();
            if (this._cachedItems[i].view) {
                // If it's a placeholder but we have data, replace it.
                if (this._cachedItems[i].view.hasAttribute("tkplaceholder") && this._cachedItems[i].data) {
                    this._cachedItems[i].view.addAttribute("tk-hide");
                    this._placeholders.push(this._cachedItems[i].view);
                    this._cachedItems[i].view = null;
                } else {
                    continue;
                }
            }
            let view = this._cachedItems[i].data
                ? this.renderItem(this._cachedItems[i].data, unusedViews.pop()) : this.placeholder;
            view.style.position = "absolute";
            this._cachedItems[i].top = -1;
            this.scrollplane.add(view);
            this._cachedItems[i].view = view;
        }

        // Remove all unused views
        while (unusedViews.length) {
            this.scrollplane.remove(unusedViews.pop());
        }

        // Get the height of all views which haven't been measured yet.
        for (i = this._firstAttachedItem; i < this._lastAttachedItem; i++) {
            // Only cache the height if we have the real contents, not a placeholder.
            if (this._cachedItems[i].data && !this._cachedItems[i].height) {
                this._cachedItems[i].height = this._cachedItems[i].view.e.offsetHeight;
                this._cachedItems[i].width = this._cachedItems[i].view.e.offsetWidth;
            }
        }

        // Fix scroll position in case we have realized the heights of elements
        // that we didn't used to know.
        this._anchorScrollTop = 0;
        for (i = 0; i < this._anchorItem.index; i++) {
            this._anchorScrollTop += this._cachedItems[i].height || this._placeholderHeight;
        }
        this._anchorScrollTop += this._anchorItem.offset;

        // Position all views.
        let curPos = this._anchorScrollTop - this._anchorItem.offset;
        i = this._anchorItem.index;
        while (i > this._firstAttachedItem) {
            curPos -= this._cachedItems[i - 1].height || this._placeholderHeight;
            i--;
        }
        while (i < this._firstAttachedItem) {
            curPos += this._cachedItems[i].height || this._placeholderHeight;
            i++;
        }

        for (i = this._firstAttachedItem; i < this._lastAttachedItem; i++) {
            this._cachedItems[i].view.style.transform = `translateY(${curPos}px)`;
            this._cachedItems[i].top = curPos;
            curPos += this._cachedItems[i].height || this._placeholderHeight;
        }

        this._runwayEnd = Math.max(this._runwayEnd, curPos + this._runwayExtraLength);
        this._runway.style.transform = `translate(0, ${this._runwayEnd}px`;
        this.scrollplane.e.scrollTop = this._anchorScrollTop;

        this.getAdditionalContent();
    }

    /**
     * Get additional content if we don't have enough currently.
     */
    getAdditionalContent() {
        // Don't issue another request if one is already in progress as we don't
        // know where to start the next request yet.
        if (this._requestInProgress)
            return;

        let itemsNeeded = this._lastAttachedItem - this._loadedItems;
        if (itemsNeeded <= 0)
            return;
        this._requestInProgress = true;
        this.fetch(itemsNeeded).then(this.addContent.bind(this));
    }

    /**
     * Adds an empty item to the item cache.
     */
    addItem() {
        this._cachedItems.push({
            data: null,
            view: null,
            height: 0,
            width: 0,
            top: 0
        });
    }

    /**
     * Adds the given array of items to the items list and then calls
     * attachContent to update the displayed content.
     * 
     * @param {Array<Object>} items The array of items to be added to the infinite
     *     scroller list.
     */
    addContent(items) {
        this._requestInProgress = false;

        for (let i = 0; i < items.length; i++) {
            if (this._cachedItems.length <= this._loadedItems)
                this.addItem();
            this._cachedItems[this._loadedItems++].data = items[i];
        }

        this.attachContent();
    }

    /**
     * A callback for when an item is recieved after a fetch() is done.
     * It is passed the item that was fetched as the first parameter and
     * a view to render it into. Return the rendered view.
     * @type {function(Object, TkView):TkView} 
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

    /**
     * Inherited from TkView, but the setter also triggers
     * a recalculation of element positioning so that the 
     * scroll works correctly afterwards.
     */
    get parent() {
        return super.parent;
    }

    set parent(value) {
        super.parent = value;
        if(this._placeholderView)
            this.onResize();
    }

}