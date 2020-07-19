/* TODO */
class TkMedia extends TkView {

    constructor(tag, options = {}) {
        options.tag = tag;
        super(options);

        this.showControls = options.showControls ?? true;

        if (options.source !== undefined)
            this.source = options.source;

        if (options.autoplay !== undefined)
            this.autoplay = options.autoplay;
    }

    get source() {
        return this.e.src;
    }

    set source(value) {
        this.e.src = value;
    }

    get showControls() {
        return this.hasAttribute("controls");
    }

    set showControls(value) {
        this.attributeIf(value, "controls");
    }

    get autoplay() {
        return this.hasAttribute("autoplay");
    }

    set autoplay(value) {
        this.attributeIf(value, "autoplay");
    }

}

/* TODO */
class TkAudio extends TkMedia {

    constructor(options = {}) {
        super("audio", options);
    }

}

/* TODO */
class TkVideo extends TkMedia {

    constructor(options = {}) {
        super("video", options);
    }

}