// enums
var tkDialogResult= {
  NOTHING: 0,
  OK: 1,
  CANCEL: 2,
  CLOSE: 3,
  ABORT: 4,
  IGNORE: 5,
  YES: 6,
  NO: 7,
  RETRY: 8
};

class tkDialog extends tkWidget
{
	constructor()
	{
		super();
		this.element = make("div"); 
		this.className = "modal fade";

		this.modal = make("div");
		this.modal.className = "modal-dialog modal-dialog-centered";
		this.modal.role = "document";
		this.element.appendChild(this.modal);

		this.modalContent = make("div");
		this.modalContent.className = "modal-content";
		this.modal.appendChild(this.modalContent);
				
		this.modalHeader = make("div");
		this.modalHeader.className = "modal-header";
		this.modalContent.appendChild(this.modalHeader);

		this.modalTitle =  make("h5");
		this.titleNode = say("");
		this.title = "";
		this.modalTitle.appendChild(this.titleNode);
		this.modalTitle.className = "modal-title";
		this.modalHeader.appendChild(this.modalTitle);

		this.modalBody = make("div");
		this.modalBody.className = "modal-body";
		this.modalContent.appendChild(this.modalBody);

		this.modalFooter = make("div");
		this.modalFooter.className = "modal-footer tkButtonPanel";
		this.modalContent.appendChild(this.modalFooter);
		
		/* 	An array of tkDialogResult listing 
			the buttons that are shown */
		this.choices = [tkDialogResult.OK];
		this.choicesButtons = [];

		this.isOpen = false;
	}
	
	addContent(_content)
	{
		this.modalBody.appendChild(_content);
	}
	
	removeContent(_content)
	{
		this.modalBody.removeChild(_content);
	}

	get title()
	{
		return this.modalTitle.nodeValue;
	}

	set title(_title)
	{
		if (_title == "")
			this.modalTitle.style.display = "none";
		else
			this.modalTitle.style.display = "block";

		this.titleNode.nodeValue = _title;
	}

	/*	Returns a tkDialogResult that 
		corresponds to the button clicked */
	show(_on_dialog_result)
	{
		this.isOpen = true;
		$(this.element).modal('show')

		if(!_on_dialog_result) 
			_on_dialog_result = function() {};
		
		// Make sure to clear buttons from previous opening
		var buttonArea = makeElement(this.modalFooter);
		buttonArea.clear();
		
		var dialog = this;

		this.choicesButtons = [];
		if (this.choices.length < 1)
			this.modalFooter.style.display = "none";
		else
			this.modalFooter.style.display = "block";

		for(var i=0;i<this.choices.length;i++) 
		{
			var button = new tkButton();
			var result = tkDialogResult.NOTHING;

			switch (this.choices[i]) 
			{
				case tkDialogResult.NOTHING:
					continue;
				case tkDialogResult.OK:
					button.text = "OK";
					button.element.onclick = function() {
						result = tkDialogResult.OK;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.CANCEL:
					button.text = "Cancel";
					button.className = "btn btn-secondary";
					button.element.onclick = function() {
						result = tkDialogResult.CANCEL;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.CLOSE:
						button.text = "Close";
						button.className = "btn btn-secondary";
						button.element.onclick = function() {
							result = tkDialogResult.CLOSE;
							_on_dialog_result(result);
							dialog.close();
						};
						break;
				case tkDialogResult.ABORT:
					button.text = "Abort";
					button.className = "btn btn-danger";
					button.element.onclick = function() {
						result = tkDialogResult.ABORT;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.IGNORE:
					button.text = "Ignore";
					button.className = "btn btn-secondary";
					button.element.onclick = function() {
						result = tkDialogResult.IGNORE;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.YES:
					button.text = "Yes";
					button.element.onclick = function() {
						result = tkDialogResult.YES;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.NO:
					button.text = "No";
					button.className = "btn btn-secondary";
					button.element.onclick = function() {
						result = tkDialogResult.NO;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.RETRY:
					button.text = "Retry";
					button.className = "btn btn-secondary";
					button.element.onclick = function() {
						result = tkDialogResult.RETRY;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
			}

			this.modalFooter.appendChild(button.element);
			this.choicesButtons.push(button);
		}
	}

	close()
	{
		this.isOpen = false;
		$(this.element).modal('hide');
	}
}

class tkAboutTamarackDialog extends tkDialog
{
	constructor()
	{
		super();

		var logo = sayP("tamarack " + tamarack.version);
		logo.className = "h5 tkAboutDialogLogo";
		var lines = [logo, sayP("By Ian Martinez")];
		var credits = [	sayText("Bootstrap","h5"), sayP("Copyright (c) 2011-2018 Twitter, Inc"),
						sayText("jQuery","h5"), sayP("Copyright (c) JS Foundation"),
						sayText("Breeze Icons","h5"), sayP("Copyright (c) 2014 Uri Herrera and others"),];

		this.notebook = new tkNotebook();

		var aboutTab = new tkNotebookPage("Tamarack", "aboutTab");
		lines.forEach((e) => aboutTab.addContent(e));

		var creditsTab = new tkNotebookPage("Credits", "creditsTab");
		creditsTab.contentArea.classList.add("tkAboutDialogCredits");
		credits.forEach((e) => creditsTab.addContent(e));

		this.notebook.addPages(aboutTab,creditsTab);
		this.addContent(this.notebook.element);

		this.choices = [tkDialogResult.OK];
		this.title = "About";
	}
}

class tkFontDialog extends tkDialog
{
	constructor()
	{
		super();

		this.choices = [tkDialogResult.OK,tkDialogResult.CANCEL];

		this.fontPicker = new tkFontPicker();
		this.addContent(this.fontPicker.element);
		this.element.style.minWidth = "35%";
		this.title = "Font";
		this.addClass("tkFontDialog");
	}
	
	get font()
	{
		return this.fontPicker.font;
	}
	
	set font(_font)
	{
		this.fontPicker.font = _font;
	}
}

class tkFontPicker extends tkWidget
{
	constructor()
	{
		super();

		this.element = make("div");
		this.className = "tkFontPicker";

		this.choices = [tkDialogResult.OK,tkDialogResult.CANCEL];
		
		this.fontFamily = sayP("Font Family:");
		this.fontFamily.className = "tkFontPickerTitle";
		this.fontFamilyList = new tkList();
		this.fontFamilyList.allowMultipleSelection = false;
		this.fontFamilyArray = ["Arial","Georgia","Times New Roman"];
		this.fontFamilyArray.forEach((value) => {
			var item = new tkListItem();
			item.text = value;
			this.fontFamilyList.addItem(item);
		});

		this.fontDemoTitle = sayP("Font Preview:");
		this.fontDemoTitle.className = "tkFontPickerTitle";
		this.fontDemo = new tkText("pre");
		this.fontDemo.className = "tkFontPickerPreview";
		this.fontDemo.text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n1234567890 ?!.";

		this.addElement(this.fontFamily,this.fontFamilyList.element,this.fontDemoTitle, this.fontDemo.element);

		this.intFont = new tkFont("Arial","24px","normal","normal");
		this.refreshFont();
	}

	get font()
	{
		return this.intFont;
	}

	set font(_font)
	{		
		
	}

	refreshFont()
	{
		
	}
}

class tkColorDialog extends tkDialog
{
	constructor()
	{
		super();

		this.choices = [tkDialogResult.OK,tkDialogResult.CANCEL];

		this.colorPicker = new tkColorPicker();
		this.addContent(this.colorPicker.element);
		this.title = "Color";
		this.addClass("tkColorDialog");
	}

	get color()
	{
		return this.colorPicker.color;
	}
	
	set color(_color)
	{
		this.colorPicker.color = _color;
	}
}

class tkColorPicker extends tkWidget
{
	constructor()
	{
		super();

		this.element = make("div");
		this.className = "tkColorPicker";

		this.leftPane = make("div");
		this.leftPane.className = "tkColorPickerLeft";
		this.element.appendChild(this.leftPane);

		this.rightPane = make("div");
		this.rightPane.className = "tkColorPickerRight";
		this.element.appendChild(this.rightPane);

		this.colorPreview = make("div");
		this.colorPreview.className = "tkColorPickerPreview";
		this.colorPreviewContainer = make("div");
		this.colorPreviewContainer.className = "tkColorPickerPreviewContainer";
		this.previewTitle = sayP("Preview");
		this.previewTitle.className = "tkSliderTitle";
		this.rightPane.appendChild(this.previewTitle);
		this.colorPreviewContainer.appendChild(this.colorPreview);
		this.rightPane.appendChild(this.colorPreviewContainer);

		this.choices = [tkDialogResult.OK,tkDialogResult.CANCEL];

		var colorPicker = this;
		
		this.hueSlider = new tkSlider();
		this.hueSlider.className= "tkColorSlider"; 
		this.hueSlider.min = 0;
		this.hueSlider.max = 360;
		this.hueSlider.value = 0;
		this.hueSlider.e.onchange = function() {
			colorPicker.grabColor();
		};
		this.hueSliderContainer = make("div");
		this.hueSliderContainer.className = "tkColorSliderContainer";
		this.hueSlider.addToElement(this.hueSliderContainer);
		this.leftPane.appendChild(this.hueSliderContainer);

		this.saturationSlider = new tkSlider();		
		this.saturationSlider.className= "tkColorSlider"; 
		this.saturationSlider.min = 0;
		this.saturationSlider.max = 100;
		this.saturationSlider.value = 50;
		this.saturationSlider.e.onchange = function() {
			colorPicker.grabColor();
		};
		this.saturationSliderContainer = make("div");
		this.saturationSliderContainer.className = "tkColorSliderContainer";
		this.saturationSlider.addToElement(this.saturationSliderContainer);
		this.leftPane.appendChild(this.saturationSliderContainer);

		this.lightnessSlider = new tkSlider();	
		this.lightnessSlider.className= "tkColorSlider"; 
		this.lightnessSlider.min = 0;
		this.lightnessSlider.max = 100;
		this.lightnessSlider.value = 50;
		this.lightnessSlider.e.onchange = function() {
			colorPicker.grabColor();			
		};
		this.lightnessSliderContainer = make("div");
		this.lightnessSliderContainer.className = "tkColorSliderContainer";
		this.lightnessSlider.addToElement(this.lightnessSliderContainer);
		this.leftPane.appendChild(this.lightnessSliderContainer);

		this.alphaSlider = new tkSlider();
		this.alphaSlider.className= "tkColorSlider"; 
		this.alphaSlider.min = 0;
		this.alphaSlider.max = 1;
		this.alphaSlider.value = 1;
		this.alphaSlider.step = 0.01;
		this.alphaSlider.e.onchange = function() {
			colorPicker.grabColor();
		};
		this.alphaSliderContainer = make("div");
		this.alphaSliderContainer.className = "tkColorSliderContainer";
		this.alphaSlider.addToElement(this.alphaSliderContainer);
		this.leftPane.appendChild(this.alphaSliderContainer);

		this.textInput = new tkColorTextInput();
		this.textInput.onInput = function()	{
			if(colorPicker.textInput.isValidColor())
			{
				var new_color = new tkColor();
				new_color.parse(colorPicker.textInput.element.value);
				colorPicker.color = new_color;				
			}
		};
		this.textInput.addToElement(this.leftPane);

		this.internalColor = new tkColor();
		this.internalColor.fromRgba(0,0,0,1);
		this.color = this.internalColor;
		this.updateColor();
	}

	get color()
	{
		return this.internalColor;
	}

	set color(_color)
	{		
		this.internalColor = _color;
		this.updateColor();
	}

	// Set color to the sliders' values
	grabColor()
	{
		var new_color = new tkColor();
		new_color.h = this.hueSlider.valueAsNumber;
		new_color.s = this.saturationSlider.valueAsNumber;
		new_color.l = this.lightnessSlider.valueAsNumber;		
		new_color.a = this.alphaSlider.valueAsNumber;
		
		this.color = new_color;
	}
	
	// Update the sliders to reflect the current color
	updateColor()
	{		
		this.hueSlider.value = this.color.h;
		this.saturationSlider.value = this.color.s;		
		this.lightnessSlider.value = this.color.l;
		this.alphaSlider.value = this.color.a;		
				
		var hue = [];
		for(var i=0;i<=360;i++)
			hue.push("hsla(" + i + "," + this.saturationSlider.valueAsNumber + "%," + this.lightnessSlider.valueAsNumber + "%," + this.alphaSlider.valueAsNumber + ")");	
		this.hueSlider.e.style.background =  createLinearGradient(90,hue);
		
		var saturation = [];
		for(var i=0;i<=100;i++)
			saturation.push("hsla(" + this.hueSlider.valueAsNumber + "," + i + "%," + this.lightnessSlider.valueAsNumber + "%," + this.alphaSlider.valueAsNumber + ")");	
		this.saturationSlider.e.style.background =  createLinearGradient(90,saturation);	
		
		var lightness = [];
		for(var i=0;i<=100;i++)
			lightness.push("hsla(" + this.hueSlider.valueAsNumber + "," + this.saturationSlider.valueAsNumber + "%," + i + "%," + this.alphaSlider.valueAsNumber + ")");	
		this.lightnessSlider.e.style.background =  createLinearGradient(90,lightness);
		
		var alpha = [];
		for(var i=0;i<=1;i+=0.01)
			alpha.push("hsla(" + this.hueSlider.valueAsNumber + "," + this.saturationSlider.valueAsNumber + "%," + this.lightnessSlider.valueAsNumber + "%," + i + ")");	
		this.alphaSlider.e.style.background =  createLinearGradient(90,alpha);
		
		this.colorPreview.style.backgroundColor = this.color.getHslaCss();
		this.textInput.e.value = this.color.getHslaCss();
	}
}

class tkColorTextInput extends tkTextInput
{
	constructor()
	{
		super();

		this.onInput = function() {};
		this.isUserInput = true;
		var textInput = this;
		this.element.addEventListener("input", function() {
			if(textInput.isUserInput)
				textInput.onInput();
		});
	}

	isValidColor()
	{
		return tkColor.isColor(this.element.value);
	}
}
