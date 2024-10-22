/**
 * TODO: 
 *  - Allow disabling of alpha channel
 *  - Allow hiding unwanted pages
 *  - Color shades tab
 *  - Palettes
 *  - Set page order
 */

/**
 * A color chooser that allows you to choose colors in any CSS format.
 */
class TkColorChooser extends TkStack {

    /**
     * Create a new TkColorChooser.
     * 
     * @param {Ang} options Same as TkStack.
     * @param {TkColor?|String?} (defaults to black) options.color The initial color of the color chooser.
     * @param {Boolean?} options.preview (defaults to true) If a preview of the color should be shown to the side.
     */
    constructor(options = {}) {
        super(options);
        this.addViewName("tkcolorchooser");
        this.direction = TkStackDirection.HORIZONTAL;

        // Set up stacks
        this.editStack = new TkStack({
            parent: this,
            direction: TkStackDirection.VERTICAL
        });

        // Set up notebook
        this.colorSystemNotebook = new TkNotebook({ parent: this.editStack });
        this.hslPage = new TkPage({ title: "HSL" });
        this.rgbPage = new TkPage({ title: "RGB" });
        this.cssPage = new TkPage({ title: "CSS" });
        this.infoPage = new TkPage({ title: "Info" });
        this.colorSystemNotebook.add(this.hslPage, this.rgbPage, this.cssPage, this.infoPage);

        // Set up stacks
        this.hslSliderStack = new TkStack({
            parent: this.hslPage.content,
            direction: TkStackDirection.VERTICAL
        });

        this.rgbSliderStack = new TkStack({
            parent: this.rgbPage.content,
            direction: TkStackDirection.VERTICAL
        });

        this.cssStack = new TkStack({
            parent: this.cssPage.content,
            direction: TkStackDirection.VERTICAL
        });

        this.infoStack = new TkStack({
            parent: this.infoPage.content,
            direction: TkStackDirection.VERTICAL,
            fill: true
        });

        // Handler for each slider
        let colorChooser = this;
        this.isUpdating = false;
        this._lastSelectedCssItem = null;
        this.colorChangeHandler = () => {
            if (colorChooser.isUpdating)
                return;

            let a = colorChooser.aSlider.value;

            let activePage = this.colorSystemNotebook.active;
            if (activePage == this.hslPage) {
                this.aSlider.visible = true;
                let h = colorChooser.hSlider.value;
                let s = colorChooser.sSlider.value;
                let l = colorChooser.lSlider.value;
                colorChooser.color = new TkColor(`hsla(${h}, ${s}%, ${l}%, ${a})`);
            } else if (activePage == this.rgbPage) {
                this.aSlider.visible = true;
                let r = colorChooser.rSlider.value;
                let g = colorChooser.gSlider.value;
                let b = colorChooser.bSlider.value;
                colorChooser.color = new TkColor(`rgba(${r}, ${g}, ${b}, ${a})`);
            } else if (activePage == this.cssPage) {
                this.aSlider.visible = false;
                let selectedCssItem = this.cssColorList.selectedItem;
                this._lastSelectedCssItem = selectedCssItem;

                if (selectedCssItem !== null)
                    colorChooser.color = selectedCssItem.data.color;
            } else if (activePage == this.infoPage) {
                this.aSlider.visible = false;
                this.updateInfo();
            }
        };

        // Update color when the notebook pages are changed
        this.colorSystemNotebook.on("activechanged", () => {
            colorChooser.colorChangeHandler();
            colorChooser.cssColorList.scrollToSelected();
        });

        // Hue
        this.hSlider = new TkColorSlider({
            parent: this.hslSliderStack,
            min: 0,
            max: 360,
            step: 1,
            value: 0
        });
        this.hSlider.sliderInput.on("change", this.colorChangeHandler);

        // Saturation
        this.sSlider = new TkColorSlider({
            parent: this.hslSliderStack,
            min: 0,
            max: 100,
            step: 1,
            value: 50
        });
        this.sSlider.sliderInput.on("change", this.colorChangeHandler);

        // Lightness
        this.lSlider = new TkColorSlider({
            parent: this.hslSliderStack,
            min: 0,
            max: 100,
            step: 1,
            value: 50
        });
        this.lSlider.sliderInput.on("change", this.colorChangeHandler);

        // Red
        this.rSlider = new TkColorSlider({
            parent: this.rgbSliderStack,
            min: 0,
            max: 255,
            step: 1,
            value: 0
        });
        this.rSlider.sliderInput.on("change", this.colorChangeHandler);

        // Green
        this.gSlider = new TkColorSlider({
            parent: this.rgbSliderStack,
            min: 0,
            max: 255,
            step: 1,
            value: 0
        });
        this.gSlider.sliderInput.on("change", this.colorChangeHandler);

        // Blue
        this.bSlider = new TkColorSlider({
            parent: this.rgbSliderStack,
            min: 0,
            max: 255,
            step: 1,
            value: 0
        });
        this.bSlider.sliderInput.on("change", this.colorChangeHandler);

        // CSS color list
        this.cssColorList = new TkList({
            parent: this.cssStack,
            classes: ["colorList"]
        });
        for (let color of TkColor.hueOrderedCssColors) {
            let cssColorItem = new TkColorItem({
                color: color.raw,
                text: color.name,
                textMatchesColor: false,
                data: color
            });

            this.cssColorList.add(cssColorItem);
        }
        this.cssColorList.on("selectedchanged", this.colorChangeHandler);

        // Info page
        this.cssNameLabel = new TkField({ parent: this.infoStack, title: "CSS Name:" });
        this.hexLabel = new TkField({ parent: this.infoStack, title: "HEX:" });
        this.hslaLabel = new TkField({ parent: this.infoStack, title: "HSLA:" });
        this.rgbaLabel = new TkField({ parent: this.infoStack, title: "RGBA:" });

        // Alpha
        this.aSlider = new TkColorSlider({
            parent: this.editStack,
            min: 0,
            max: 1,
            step: 0.01,
            value: 1
        });
        this.aSlider.sliderInput.on("change", this.colorChangeHandler);
        this.aSlider.addClass("tkcolor-system-width");

        // Text input
        this.textInput = new TkInput({ parent: this.editStack, type: "text", classes: ["tkcolor-system-width"] });
        this.textInput.on("input", () => {
            let color = new TkColor(colorChooser.textInput.value);

            if (color.isValid)
                colorChooser.color = color;
        });

        this.textInput.on("blur", () => {
            colorChooser.updateColor();
        });

        // Preview
        this.preview = new TkColorPreview({ parent: this });
        if (options.preview !== undefined)
            this.preview.visible = options.preview;

        // Set color from options, if specified, or default to black
        if (options.color !== undefined) {
            if (TkObject.is(options.color, TkColor))
                this._color = options.color.clone();
            else if (TkObject.isString(options.color))
                this._color = new TkColor(options.color);
        } else {
            this._color = new TkColor("black");
        }

        // Draw slider backgrounds with current color
        this.updateColor();
    }

    /**
     * The current color of the color chooser.
     * @type {TkColor}
     */
    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
        this.updateColor();
        this.trigger("colorchanged");
    }

    /**
     * Update the all of the views in the color chooser to match the 
     * new color.
     */
    updateColor() {
        let activePage = this.colorSystemNotebook.active;

        let h = this._color.h;
        let s = this._color.s;
        let l = this._color.l;

        let r = this._color.r;
        let g = this._color.g;
        let b = this._color.b;

        let a = this._color.a;

        // Update sliders to match color
        this.isUpdating = true;
        this.hSlider.value = h;
        this.sSlider.value = s;
        this.lSlider.value = l;
        this.rSlider.value = r;
        this.gSlider.value = g;
        this.bSlider.value = b;

        // Get the first CSS color matching this color
        let cssColorName = this.color.asCssName(false);
        let matchingCssItem = null;
        if (cssColorName !== "") {
            for (let item of this.cssColorList.children) {
                if (item.data.name === cssColorName) {
                    matchingCssItem = item;
                    continue;
                }
            }
        }

        // Only update if the value is actually different (ignoring name),
        // because some CSS colors (aqua/cyan, gray/grey) have the same value
        if ((this._lastSelectedCssItem !== null && matchingCssItem !== null)
            && (this._lastSelectedCssItem.data.raw === matchingCssItem.data.raw)) {
            matchingCssItem = this._lastSelectedCssItem;

            // Update text input
            if (activePage == this.cssPage && !this.textInput.hasFocus()) {
                this.textInput.value = matchingCssItem.data.raw;
            }
        }

        this.cssColorList.selectedItem = matchingCssItem;
        this.aSlider.value = a;
        this.isUpdating = false;

        // Draw slider backgrounds
        if (activePage == this.hslPage) {
            // Draw hue slider background
            let hue = [];
            for (var i = 0; i <= 360; i++)
                hue.push(`hsla(${i}, ${s}%, ${l}%, ${a})`);
            this.hSlider.sliderInput.e.style.background = TkGradient.linear(90, hue);

            // Draw saturation slider background
            let saturation = [];
            for (var i = 0; i <= 100; i++)
                saturation.push(`hsla(${h}, ${i}%, ${l}%, ${a})`);
            this.sSlider.sliderInput.e.style.background = TkGradient.linear(90, saturation);

            // Draw lightness slider background
            let lightness = [];
            for (var i = 0; i <= 100; i++)
                lightness.push(`hsla(${h}, ${s}%, ${i}%, ${a})`);
            this.lSlider.sliderInput.e.style.background = TkGradient.linear(90, lightness);

            // Update text input
            if (!this.textInput.hasFocus()) {
                this.isUpdating = true;
                this.textInput.value = this._color.asHsla();
                this.isUpdating = false;
            }
        } else if (activePage == this.rgbPage) {
            // Draw red slider background
            let red = [];
            for (var i = 0; i <= 255; i++)
                red.push(`rgba(${i}, 0, 0, ${a})`);
            this.rSlider.sliderInput.e.style.background = TkGradient.linear(90, red);

            // Draw green slider background
            let green = [];
            for (var i = 0; i <= 255; i++)
                green.push(`rgba(0, ${i}, 0, ${a})`);
            this.gSlider.sliderInput.e.style.background = TkGradient.linear(90, green);

            // Draw blue slider background
            let blue = [];
            for (var i = 0; i <= 255; i++)
                blue.push(`rgba(0, 0, ${i}, ${a})`);
            this.bSlider.sliderInput.e.style.background = TkGradient.linear(90, blue);

            // Update text input
            if (!this.textInput.hasFocus()) {
                this.isUpdating = true;
                this.textInput.value = this._color.asRgba();
                this.isUpdating = false;
            }
        } else if (activePage == this.infoPage) {
            this.updateInfo();
        }

        // Draw alpha slider background
        let alpha = [];
        for (var i = 0; i <= 1; i += 0.01)
            alpha.push(`hsla(${h}, ${s}%, ${l}%, ${i})`);
        this.aSlider.sliderInput.e.style.background = TkGradient.linear(90, alpha);

        // Update preview color
        this.preview.color = this._color;
    }

    /**
     * Update the color info page.
     */
    updateInfo() {
        let cssColor = this._color.asCssName();
        if (cssColor.length > 0) {
            this.cssNameLabel.content.text = cssColor;
            this.cssNameLabel.visible = true;
        } else {
            this.cssNameLabel.visible = false;
        }

        this.hexLabel.content.text = this._color.asHex();
        this.hslaLabel.content.text = this._color.asHsla();
        this.rgbaLabel.content.text = this._color.asRgba();
    }

}

/**
 * A slider view used inside a TkColorChooser.
 */
class TkColorSlider extends TkStack {

    constructor(options = {}) {
        super(options);
        this.addViewName("tkcolorslider-container");
        this.direction = TkStackDirection.HORIZONTAL;

        this.sliderInput = new TkSlider({
            parent: this,
            min: options.min,
            max: options.max,
            step: options.step,
            value: options.value
        });
        this.sliderInput.addViewName("tkcolorslider");
    }

    get value() {
        return this.sliderInput.valueAsNumber;
    }

    set value(value) {
        return this.sliderInput.value = value;
    }

}

/**
 * A view to preview color in.
 */
class TkColorPreview extends TkView {

    constructor(options = {}) {
        super(options);
        this.addViewName("tkcolorpreview");
        this.colorView = new TkView({ parent: this });
        this.colorView.addViewName("tkcolorpreview-colorview");
    }

    get color() {
        return new TkColor(this.colorView.e.style.backgroundColor);
    }

    set color(value) {
        this.colorView.e.style.backgroundColor = value.asHsla();
    }

}

/**
 * A color in a list of colors. Used in TkColorChooser.
 */
class TkColorItem extends TkLabel {

    /**
     * 
     * @param {Object} options The options object (same as TkLabel, minus the icon option).
     * @param {String} options.color The color of the item.
     * @param {Boolean} options.textMatchesColor If the text should automatically
     * update to match the color value.
     */
    constructor(options = {}) {
        super(options);
        this.addViewName("tkcoloritem");
        this.icon = new TkView({ classes: ["color-icon"] });
        this._textMatchesColor = options.textMatchesColor ?? true;

        if (options.color !== undefined)
            this.color = options.color.toString();
        else
            this.color = "#ffffff";
    }

    /**
     * The color value that is associated with this item.
     * @{String}
     */
    get color() {
        return this._colorData;
    }

    set color(value) {
        this._colorData = value;
        this.icon.e.style.background = this._colorData;

        if (this.textMatchesColor)
            this.text = this._colorData;
    }

    /**
     * If the text should automatically change to display
     * whenever color is set.
     * @type {Boolean}
     */
    get textMatchesColor() {
        return this._textMatchesColor;
    }

    set textMatchesColor(value) {
        this._textMatchesColor = value;

        let currentBackground = this.icon.e.style.background;
        if (value && currentBackground.length > 0) {
            this.content.text = this.icon.e.style.background;
        }
    }

}

class TkColorWell extends TkButton {

    constructor(options = {}) {
        options.label = new TkColorItem({ color: options.color });
        super(options);
        

        this.colorModal = new TkModal({
            title: "Color",
            choices: [TkChoice.OK, TkChoice.CANCEL],
            defaultChoice: TkChoice.OK
        });
        this.colorChooser = new TkColorChooser({ parent: this.colorModal.content });

        let well = this;
        this.on("click", () => {
            well.colorChooser.color = new TkColor(this.label.color);
            well.colorModal.show();
        });

        this.colorModal.on("modalclosed", () => {
            if (well.colorModal.result === TkChoice.OK) {
                well.color = well.colorChooser.color;
            }
        });
    }

    get color() {
        return this.label.color;
    }

    set color(value) {
        this.label.color = value;
        this.trigger("colorchanged");
    }

}