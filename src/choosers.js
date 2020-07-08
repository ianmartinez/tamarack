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

class TkColorChooser extends TkStack {

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
        this.hslaPage = new TkNotebookPage({ title: "HSLA" });
        this.rgbaPage = new TkNotebookPage({ title: "RGBA" });
        this.cssPage = new TkNotebookPage({ title: "CSS" });
        this.colorSystemNotebook.add(this.hslaPage, this.rgbaPage, this.cssPage);

        // Set up stacks
        this.hslaSliderStack = new TkStack({
            parent: this.hslaPage.content,
            direction: TkStackDirection.VERTICAL
        });

        this.rgbaSliderStack = new TkStack({
            parent: this.rgbaPage.content,
            direction: TkStackDirection.VERTICAL
        });

        this.cssStack = new TkStack({
            parent: this.cssPage.content,
            direction: TkStackDirection.VERTICAL
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
            if (activePage == this.hslaPage) {
                this.aSlider.visible = true;
                let h = colorChooser.hSlider.value;
                let s = colorChooser.sSlider.value;
                let l = colorChooser.lSlider.value;
                colorChooser.color = new TkColor(`hsla(${h}, ${s}%, ${l}%, ${a})`);
            } else if (activePage == this.rgbaPage) {
                this.aSlider.visible = true;
                let r = colorChooser.rSlider.value;
                let g = colorChooser.gSlider.value;
                let b = colorChooser.bSlider.value;
                colorChooser.color = new TkColor(`rgba(${r}, ${g}, ${b}, ${a})`);
            } else if (activePage == this.cssPage) {
                this.aSlider.visible = false;
                let selectedCssItem = this.cssColorList.selectedItem;
                this._lastSelectedCssItem = selectedCssItem;

                if (selectedCssItem != null)
                    colorChooser.color = selectedCssItem.dataValue.color;
            }
        };

        // Update color when the notebook pages are changed
        this.colorSystemNotebook.on("activechanged", () => {
            colorChooser.colorChangeHandler();
            colorChooser.cssColorList.scrollToSelected();
        });

        // Hue
        this.hSlider = new TkColorSlider({
            parent: this.hslaSliderStack,
            min: 0,
            max: 360,
            step: 1,
            value: 0
        });
        this.hSlider.sliderInput.on("change", this.colorChangeHandler);

        // Saturation
        this.sSlider = new TkColorSlider({
            parent: this.hslaSliderStack,
            min: 0,
            max: 100,
            step: 1,
            value: 50
        });
        this.sSlider.sliderInput.on("change", this.colorChangeHandler);

        // Lightness
        this.lSlider = new TkColorSlider({
            parent: this.hslaSliderStack,
            min: 0,
            max: 100,
            step: 1,
            value: 50
        });
        this.lSlider.sliderInput.on("change", this.colorChangeHandler);

        // Red
        this.rSlider = new TkColorSlider({
            parent: this.rgbaSliderStack,
            min: 0,
            max: 255,
            step: 1,
            value: 0
        });
        this.rSlider.sliderInput.on("change", this.colorChangeHandler);

        // Green
        this.gSlider = new TkColorSlider({
            parent: this.rgbaSliderStack,
            min: 0,
            max: 255,
            step: 1,
            value: 0
        });
        this.gSlider.sliderInput.on("change", this.colorChangeHandler);

        // Blue
        this.bSlider = new TkColorSlider({
            parent: this.rgbaSliderStack,
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
            let cssColorItem = new TkLabel({
                text: color.name,
                hideEmptyImage: false
            });
            cssColorItem.imageView.addClass("cssColor");
            cssColorItem.imageView.e.style.background = color.raw;
            cssColorItem.dataValue = color;

            this.cssColorList.add(cssColorItem);
        }
        this.cssColorList.on("selectedchanged", this.colorChangeHandler);

        // Alpha
        this.aSlider = new TkColorSlider({
            parent: this.editStack,
            min: 0,
            max: 1,
            step: 0.01,
            value: 1
        });
        this.aSlider.sliderInput.on("change", this.colorChangeHandler);
        this.aSlider.addClass("colorSystemWidth");

        // Preview
        this.previewView = new TkColorPreview({ parent: this });

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

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
        this.updateColor();
    }

    updateColor() {
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
        let cssColorName = this.color.asCssName(false);
        let matchingCssItem = null;
        if (cssColorName !== "") {
            for (let item of this.cssColorList.children) {
                if (item.dataValue.name === cssColorName) {
                    matchingCssItem = item;
                    continue;
                }
            }
        }
        
        // Only update if the value is actually different (ignoring name),
        // because some CSS colors (aqua/cyan, gray/grey) have the same value
        if ((this._lastSelectedCssItem !== null && matchingCssItem !== null)
            && (this._lastSelectedCssItem.dataValue.raw === matchingCssItem.dataValue.raw)) {
            matchingCssItem = this._lastSelectedCssItem;
        }

        this.cssColorList.selectedItem = matchingCssItem;
        this.aSlider.value = a;
        this.isUpdating = false;

        // Draw slider backgrounds
        let activePage = this.colorSystemNotebook.active;
        if (activePage == this.hslaPage) {
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
        } else if (activePage == this.rgbaPage) {
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
        }

        // Draw alpha slider background
        let alpha = [];
        for (var i = 0; i <= 1; i += 0.01)
            alpha.push(`hsla(${h}, ${s}%, ${l}%, ${i})`);
        this.aSlider.sliderInput.e.style.background = TkGradient.linear(90, alpha);

        // Update preview color
        this.previewView.color = this._color;
    }

}