class TkColorSlider extends TkStack {

    constructor(options) {
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

class TkColorChooser extends TkView {

    constructor(options) {
        super(options);
        this.addViewName("tkcolorchooser");

        this.hslaSliderStack = new TkStack({
            parent: this,
            direction: TkStackDirection.VERTICAL
        });

        // Handler for each slider
        let colorChooser = this;
        this.isUpdating = false;
        this.sliderHandler = () => {
            if (colorChooser.isUpdating)
                return;

            let h = colorChooser.hSlider.value;
            let s = colorChooser.sSlider.value;
            let l = colorChooser.lSlider.value;
            let a = colorChooser.aSlider.value;

            colorChooser.color = new TkColor(`hsla(${h}, ${s}%, ${l}%, ${a})`);
        };

        // Hue
        this.hSlider = new TkColorSlider({
            parent: this.hslaSliderStack,
            min: 0,
            max: 360,
            step: 1,
            value: 0
        });
        this.hSlider.sliderInput.on("change", this.sliderHandler);

        // Saturation
        this.sSlider = new TkColorSlider({
            parent: this.hslaSliderStack,
            min: 0,
            max: 100,
            step: 1,
            value: 50
        });
        this.sSlider.sliderInput.on("change", this.sliderHandler);

        // Lightness
        this.lSlider = new TkColorSlider({
            parent: this.hslaSliderStack,
            min: 0,
            max: 100,
            step: 1,
            value: 50
        });
        this.lSlider.sliderInput.on("change", this.sliderHandler);

        // Alpha
        this.aSlider = new TkColorSlider({
            parent: this.hslaSliderStack,
            min: 0,
            max: 1,
            step: 0.01,
            value: 1
        });
        this.aSlider.sliderInput.on("change", this.sliderHandler);

        // Color
        this._color = new TkColor("black");
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
        // Update sliders to match color
        this.isUpdating = true;
        this.hSlider.value = this._color.h;
        this.sSlider.value = this._color.s;
        this.lSlider.value = this._color.l;
        this.aSlider.value = this._color.a;
        this.isUpdating = false;

        // Draw hue slider background
        let hue = [];
        for (var i = 0; i <= 360; i++)
            hue.push(`hsla(${i}, ${this.sSlider.value}%, ${this.lSlider.value}%, ${this.aSlider.value})`);
        this.hSlider.sliderInput.e.style.background = TkGradient.linear(90, hue);

        // Draw saturation slider background
        let saturation = [];
        for (var i = 0; i <= 100; i++)
            saturation.push(`hsla(${this.hSlider.value}, ${i}%, ${this.lSlider.value}%, ${this.aSlider.value})`);
        this.sSlider.sliderInput.e.style.background = TkGradient.linear(90, saturation);

        // Draw lightness slider background
        let lightness = [];
        for (var i = 0; i <= 100; i++)
            lightness.push(`hsla(${this.hSlider.value}, ${this.sSlider.value}%, ${i}%, ${this.aSlider.value})`);
        this.lSlider.sliderInput.e.style.background = TkGradient.linear(90, lightness);

        // Draw alpha slider background
        let alpha = [];
        for (var i = 0; i <= 1; i += 0.01)
            alpha.push(`hsla(${this.hSlider.value}, ${this.sSlider.value}%, ${this.lSlider.value}%, ${i})`);
        this.aSlider.sliderInput.e.style.background = TkGradient.linear(90, alpha);

        // TODO: update preview color
    }

}