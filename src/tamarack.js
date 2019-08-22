/**
 * Tamarack:
 * A library for 
 */


// The tamarackjs "namespace" - tk, for short
var tk = {};

// Values
tk.version = 0.5;

// Enums
tk.LayoutDirection = Object.freeze({
	HORIZONTAL: 0,
	VERTICAL: 1
});

tk.forEachProperty = function(object, callback) {
	Object.keys(object).forEach(function(key,index) {
		callback(key, index);
	});
}

// Helper functions
tk.make = function(tag) {
	return document.createElement(tag);
};

tk.text = function(text) {
	return document.createTextNode(text);
};

tk.textElement = function(tag, text) {
	var element = tk.make(tag);
	element.appendChild(tk.text(text));
	return element;
}

tk.exists = function(object) {
	return typeof object !== "undefined";
}

tk.fallback = function(object, objectIfUndefined) {
	return tk.exists(object) ? object : objectIfUndefined;
}

tk.array = class {
	static remove(array, element) {
		array.splice(array.indexOf(element), 1);
	}

	static removeAt(array, index) {
		array.splice(index, 1);
	}

	static descend(array, callback) {
		for(let i=array.length -1; i>=0; i--)
			callback(array[i], i);
	}
}

tk.Size = class {
	width = 0;
	height = 0;

	constructor(width, height) {
		this.width = tk.fallback(width, 0);
		this.height = tk.fallback(height, 0);
	}

	getArea() {
		return this.width * this.height;
	}
}

tk.EventPair = class {
	targetElement = "";
	targetEvent = "";

	constructor(targetElement, targetEvent) {
		this.targetElement = targetElement;
		this.targetEvent = targetEvent;
	}
}

// System
tk.Timer = class {

}

tk.directory = class {
	// Gets the folder that the tamarack.js folder is located in
	static get script() {
		var scripts = [];
		document.querySelectorAll('script[src]').forEach((script) => scripts.push(script.getAttribute("src")));
		var tamarackJsLocation = scripts.find((x) => x.indexOf("tamarack.js") != -1)

		return tamarackJsLocation.replace('tamarack.js', ''); 
	}

	// Gets the folder that has the icons
	static get icons()
	{
		return tk.directory.script + "icons/";
	}
}

tk.icons = {
	accessibilitySettings: tk.directory.icons + "accessibility-settings.svg",
	accessibility: tk.directory.icons + "accessibility.svg",
	accessories: tk.directory.icons + "accessories.svg",
	addressBook: tk.directory.icons + "address-book.svg",
	audioFile: tk.directory.icons + "audio-file.svg",
	audio: tk.directory.icons + "audio.svg",
	batteryCaution: tk.directory.icons + "battery-caution.svg",
	battery: tk.directory.icons + "battery.svg",
	book: tk.directory.icons + "book.svg",
	bookmark: tk.directory.icons + "bookmark.svg",
	calculator: tk.directory.icons + "calculator.svg",
	calendar: tk.directory.icons + "calendar.svg",
	camera: tk.directory.icons + "camera.svg",
	certificate: tk.directory.icons + "certificate.svg",
	characters: tk.directory.icons + "characters.svg",
	chat: tk.directory.icons + "chat.svg",
	contact: tk.directory.icons + "contact.svg",
	desktop: tk.directory.icons + "user-desktop.svg",
	development: tk.directory.icons + "development.svg",
	dialogError: tk.directory.icons + "dialog-error.svg",
	dialogInformation: tk.directory.icons + "dialog-information.svg",
	dialogWarning: tk.directory.icons + "dialog-warning.svg",
	documentExport: tk.directory.icons + "document-export.svg",
	documentImport: tk.directory.icons + "document-import.svg",
	documentNew: tk.directory.icons + "document-new.svg",
	documentOpen: tk.directory.icons + "document-open.svg",
	documentPrintPreview: tk.directory.icons + "document-print-preview.svg",
	documentPrint: tk.directory.icons + "document-print.svg",
	documentProperties: tk.directory.icons + "document-properties.svg",
	documentSaveAs: tk.directory.icons + "document-save-as.svg",
	documentSave: tk.directory.icons + "document-save.svg",
	documentTemplate: tk.directory.icons + "document-template.svg",
	document: tk.directory.icons + "document.svg",
	drawingTemplate: tk.directory.icons + "drawing-template.svg",
	drawing: tk.directory.icons + "drawing.svg",
	editClear: tk.directory.icons + "edit-clear.svg",
	editCopy: tk.directory.icons + "edit-copy.svg",
	editCut: tk.directory.icons + "edit-cut.svg",
	editDelete: tk.directory.icons + "edit-delete.svg",
	editFindReplace: tk.directory.icons + "edit-find-replace.svg",
	editFind: tk.directory.icons + "edit-find.svg",
	editPaste: tk.directory.icons + "edit-paste.svg",
	editRedo: tk.directory.icons + "edit-redo.svg",
	editSelectAll: tk.directory.icons + "edit-select-all.svg",
	editUndo: tk.directory.icons + "edit-undo.svg",
	email: tk.directory.icons + "email.svg",
	executable: tk.directory.icons + "executable.svg",
	faceAngel: tk.directory.icons + "face-angel.svg",
	faceCrying: tk.directory.icons + "face-crying.svg",
	faceDevilish: tk.directory.icons + "face-devilish.svg",
	faceGlasses: tk.directory.icons + "face-glasses.svg",
	faceGrin: tk.directory.icons + "face-grin.svg",
	faceKiss: tk.directory.icons + "face-kiss.svg",
	faceMonkey: tk.directory.icons + "face-monkey.svg",
	facePlain: tk.directory.icons + "face-plain.svg",
	faceSad: tk.directory.icons + "face-sad.svg",
	faceSmileBig: tk.directory.icons + "face-smile-big.svg",
	faceSmile: tk.directory.icons + "face-smile.svg",
	faceSurprise: tk.directory.icons + "face-surprise.svg",
	faceWink: tk.directory.icons + "face-wink.svg",
	fileManager: tk.directory.icons + "file-manager.svg",
	find: tk.directory.icons + "find.svg",
	floppy: tk.directory.icons + "floppy.svg",
	folderAdd: tk.directory.icons + "folder-add.svg",
	folderDragAccept: tk.directory.icons + "folder-drag-accept.svg",
	folderNew: tk.directory.icons + "folder-new.svg",
	folderOpen: tk.directory.icons + "folder-open.svg",
	folderRemote: tk.directory.icons + "folder-remote.svg",
	folderRemove: tk.directory.icons + "folder-remove.svg",
	folderSavedSearch: tk.directory.icons + "folder-saved-search.svg",
	folderVisiting: tk.directory.icons + "folder-visiting.svg",
	folder: tk.directory.icons + "folder.svg",
	fontFile: tk.directory.icons + "font-file.svg",
	fontSizeDecrease: tk.directory.icons + "font-size-decrease.svg",
	fontSizeIncrease: tk.directory.icons + "font-size-increase.svg",
	font: tk.directory.icons + "font.svg",
	formatIndentLess: tk.directory.icons + "format-indent-less.svg",
	formatIndentMore: tk.directory.icons + "format-indent-more.svg",
	formatJustifyCenter: tk.directory.icons + "format-justify-center.svg",
	formatJustifyFill: tk.directory.icons + "format-justify-fill.svg",
	formatJustifyLeft: tk.directory.icons + "format-justify-left.svg",
	formatJustifyRight: tk.directory.icons + "format-justify-right.svg",
	formatSub: tk.directory.icons + "format-sub.svg",
	formatSuper: tk.directory.icons + "format-super.svg",
	formatTextBold: tk.directory.icons + "format-text-bold.svg",
	formatTextItalic: tk.directory.icons + "format-text-italic.svg",
	formatTextStrikethrough: tk.directory.icons + "format-text-strikethrough.svg",
	formatTextUnderline: tk.directory.icons + "format-text-underline.svg",
	games: tk.directory.icons + "games.svg",
	gear: tk.directory.icons + "gear.svg",
	goBottom: tk.directory.icons + "go-bottom.svg",
	goDown: tk.directory.icons + "go-down.svg",
	goFirst: tk.directory.icons + "go-first.svg",
	goHome: tk.directory.icons + "go-home.svg",
	goJump: tk.directory.icons + "go-jump.svg",
	goLast: tk.directory.icons + "go-last.svg",
	goNext: tk.directory.icons + "go-next.svg",
	goPrevious: tk.directory.icons + "go-previous.svg",
	goTop: tk.directory.icons + "go-top.svg",
	goUp: tk.directory.icons + "go-up.svg",
	graphics: tk.directory.icons + "graphics.svg",
	hardDisk: tk.directory.icons + "hard-disk.svg",
	homeFolder: tk.directory.icons + "user-home.svg",
	heart: tk.directory.icons + "heart.svg",
	help: tk.directory.icons + "help.svg",
	html: tk.directory.icons + "html.svg",
	imageLoading: tk.directory.icons + "image-loading.svg",
	imageMissing: tk.directory.icons + "image-missing.svg",
	image: tk.directory.icons + "image.svg",
	important: tk.directory.icons + "important.svg",
	inputSettings: tk.directory.icons + "input-settings.svg",
	installer: tk.directory.icons + "installer.svg",
	internet: tk.directory.icons + "applications-internet.svg",
	joystick: tk.directory.icons + "joystick.svg",
	junk: tk.directory.icons + "junk.svg",
	keyboard: tk.directory.icons + "keyboard.svg",
	link: tk.directory.icons + "link.svg",
	listAdd: tk.directory.icons + "list-add.svg",
	listRemove: tk.directory.icons + "list-remove.svg",
	locale: tk.directory.icons + "locale.svg",
	lock: tk.directory.icons + "lock.svg",
	mailAttachment: tk.directory.icons + "mail-attachment.svg",
	mailForward: tk.directory.icons + "mail-forward.svg",
	mailReplyAll: tk.directory.icons + "mail-reply-all.svg",
	mailReply: tk.directory.icons + "mail-reply.svg",
	mailSendReceive: tk.directory.icons + "mail-send-receive.svg",
	mediaEject: tk.directory.icons + "media-eject.svg",
	mediaFlash: tk.directory.icons + "media-flash.svg",
	mediaPlaybackPause: tk.directory.icons + "media-playback-pause.svg",
	mediaPlaybackStart: tk.directory.icons + "media-playback-start.svg",
	mediaPlaybackStop: tk.directory.icons + "media-playback-stop.svg",
	mediaRecord: tk.directory.icons + "media-record.svg",
	mediaSeekBackward: tk.directory.icons + "media-seek-backward.svg",
	mediaSeekForward: tk.directory.icons + "media-seek-forward.svg",
	mediaSkipBackward: tk.directory.icons + "media-skip-backward.svg",
	mediaSkipForward: tk.directory.icons + "media-skip-forward.svg",
	message: tk.directory.icons + "message.svg",
	microphone: tk.directory.icons + "microphone.svg",
	monitor: tk.directory.icons + "monitor.svg",
	mouse: tk.directory.icons + "mouse.svg",
	mp3Player: tk.directory.icons + "mp3-player.svg",
	multimedia: tk.directory.icons + "multimedia.svg",
	networkError: tk.directory.icons + "network-error.svg",
	networkIdle: tk.directory.icons + "network-idle.svg",
	networkOffline: tk.directory.icons + "network-offline.svg",
	networkReceive: tk.directory.icons + "network-receive.svg",
	networkServer: tk.directory.icons + "network-server.svg",
	networkTransmitReceive: tk.directory.icons + "network-transmit-receive.svg",
	networkTransmit: tk.directory.icons + "network-transmit.svg",
	networkWired: tk.directory.icons + "network-wired.svg",
	networkWirelessEncrypted: tk.directory.icons + "network-wireless-encrypted.svg",
	networkWireless: tk.directory.icons + "network-wireless.svg",
	networkWorkgroup: tk.directory.icons + "network-workgroup.svg",
	news: tk.directory.icons + "news.svg",
	notify: tk.directory.icons + "notify.svg",
	office: tk.directory.icons + "office.svg",
	opticalDisk: tk.directory.icons + "optical-disk.svg",
	opticalDriveRemovable: tk.directory.icons + "optical-drive-removable.svg",
	opticalDrive: tk.directory.icons + "optical-drive.svg",
	other: tk.directory.icons + "other.svg",
	package: tk.directory.icons + "package.svg",
	pageAdd: tk.directory.icons + "page-add.svg",
	pageRemove: tk.directory.icons + "page-remove.svg",
	page: tk.directory.icons + "page.svg",
	photos: tk.directory.icons + "photos.svg",
	preferencesDials: tk.directory.icons + "preferences-dials.svg",
	preferences: tk.directory.icons + "preferences.svg",
	presentationTemplate: tk.directory.icons + "presentation-template.svg",
	presentation: tk.directory.icons + "presentation.svg",
	printerError: tk.directory.icons + "printer-error.svg",
	printer: tk.directory.icons + "printer.svg",
	proxy: tk.directory.icons + "proxy.svg",
	quit: tk.directory.icons + "quit.svg",
	readOnly: tk.directory.icons + "read-only.svg",
	remoteDesktop: tk.directory.icons + "remote-desktop.svg",
	screensaver: tk.directory.icons + "screensaver.svg",
	script: tk.directory.icons + "script.svg",
	session: tk.directory.icons + "session.svg",
	shortcuts: tk.directory.icons + "shortcuts.svg",
	softwareUpdateAvailable: tk.directory.icons + "software-update-available.svg",
	softwareUpdateUrgent: tk.directory.icons + "software-update-urgent.svg",
	spreadsheetTemplate: tk.directory.icons + "spreadsheet-template.svg",
	spreadsheet: tk.directory.icons + "spreadsheet.svg",
	startHere: tk.directory.icons + "start-here.svg",
	stop: tk.directory.icons + "stop.svg",
	systemMonitor: tk.directory.icons + "system-monitor.svg",
	systemShutdown: tk.directory.icons + "system-shutdown.svg",
	system: tk.directory.icons + "system.svg",
	tabNew: tk.directory.icons + "tab-new.svg",
	terminal: tk.directory.icons + "terminal.svg",
	textEdit: tk.directory.icons + "text-edit.svg",
	text: tk.directory.icons + "text.svg",
	theme: tk.directory.icons + "theme.svg",
	time: tk.directory.icons + "time.svg",
	trash: tk.directory.icons + "user-trash.svg",
	trashFull: tk.directory.icons + "user-trash-full.svg",
	unread: tk.directory.icons + "unread.svg",
	update: tk.directory.icons + "update.svg",
	users: tk.directory.icons + "users.svg",
	videoRecorder: tk.directory.icons + "video-recorder.svg",
	videoReel: tk.directory.icons + "video-reel.svg",
	viewFullscreen: tk.directory.icons + "view-fullscreen.svg",
	viewRefresh: tk.directory.icons + "view-refresh.svg",
	volumeHigh: tk.directory.icons + "volume-high.svg",
	volumeLow: tk.directory.icons + "volume-low.svg",
	volumeMedium: tk.directory.icons + "volume-medium.svg",
	volumeMute: tk.directory.icons + "volume-mute.svg",
	wallpaper: tk.directory.icons + "wallpaper.svg",
	weatherClearNight: tk.directory.icons + "weather-clear-night.svg",
	weatherClear: tk.directory.icons + "weather-clear.svg",
	weatherFewCloudsNight: tk.directory.icons + "weather-few-clouds-night.svg",
	weatherFewClouds: tk.directory.icons + "weather-few-clouds.svg",
	weatherMixed: tk.directory.icons + "weather-mixed.svg",
	weatherOvercast: tk.directory.icons + "weather-overcast.svg",
	weatherSevereAlert: tk.directory.icons + "weather-severe-alert.svg",
	weatherShowersScattered: tk.directory.icons + "weather-showers-scattered.svg",
	weatherShowers: tk.directory.icons + "weather-showers.svg",
	weatherSnow: tk.directory.icons + "weather-snow.svg",
	weatherStorm: tk.directory.icons + "weather-storm.svg",
	web: tk.directory.icons + "web.svg",
	windowNew: tk.directory.icons + "window-new.svg",
	windows: tk.directory.icons + "windows.svg"
}

tk.random = class {
	static integer(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static decimal(min, max) {
		return Math.random() < 0.5 ? 
			((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
	}

	static item(...array) {
		return array[tk.random.integer(0, array.length - 1)];
	}

	static rgbString() {
		return "rgb(" + tk.random.integer(0,255) + "," + tk.random.integer(0,255) + "," + tk.random.integer(0,255) + ")";
	}

	static rgbaString() {
		return "rgba(" + tk.random.integer(0,255) + "," + tk.random.integer(0,255) + "," + tk.random.integer(0,255) + "," + (Math.random()).toFixed(2) + ")";
	}

	static color() {
		var color = new tk.Color();
		color.randomize();

		return color;
	}

	static opaqueColor() {
		var color = new tk.Color();
		color.randomizeOpaque();

		return color;
	}
}

tk.number = class {
	static toPercent(value, max) {
		return ((value*100)/max);
	}

	static toPercentF(value, max)	{
		return this.toPercent(value, max) + "%";
	}

	static fromPercent(value, max)	{
		return ((value * max)/100);
	}
}

tk.Color = class {
	static named = {"aliceblue":"#f0f8ff", "antiquewhite":"#faebd7", "aqua":"#00ffff", "aquamarine":"#7fffd4", "azure":"#f0ffff", 
	"beige":"#f5f5dc", "bisque":"#ffe4c4", "black":"#000000", "blanchedalmond":"#ffebcd", "blue":"#0000ff", "blueviolet":"#8a2be2", 
	"brown":"#a52a2a", "burlywood":"#deb887", "cadetblue":"#5f9ea0", "chartreuse":"#7fff00", "chocolate":"#d2691e", "coral":"#ff7f50", 
	"cornflowerblue":"#6495ed", "cornsilk":"#fff8dc", "crimson":"#dc143c", "cyan":"#00ffff", "darkblue":"#00008b", "darkcyan":"#008b8b", 
	"darkgoldenrod":"#b8860b", "darkgray":"#a9a9a9", "darkgreen":"#006400", "darkkhaki":"#bdb76b", "darkmagenta":"#8b008b", 
	"darkolivegreen":"#556b2f", "darkorange":"#ff8c00", "darkorchid":"#9932cc", "darkred":"#8b0000", "darksalmon":"#e9967a", 
	"darkseagreen":"#8fbc8f", "darkslateblue":"#483d8b", "darkslategray":"#2f4f4f", "darkturquoise":"#00ced1", "darkviolet":"#9400d3", 
	"deeppink":"#ff1493", "deepskyblue":"#00bfff", "dimgray":"#696969", "dodgerblue":"#1e90ff", "firebrick":"#b22222", 
	"floralwhite":"#fffaf0", "forestgreen":"#228b22", "fuchsia":"#ff00ff", "gainsboro":"#dcdcdc", "ghostwhite":"#f8f8ff", 
	"gold":"#ffd700", "goldenrod":"#daa520", "gray":"#808080", "green":"#008000", "greenyellow":"#adff2f", "honeydew":"#f0fff0", 
	"hotpink":"#ff69b4", "indianred ":"#cd5c5c", "indigo":"#4b0082", "ivory":"#fffff0", "khaki":"#f0e68c", "lavender":"#e6e6fa", 
	"lavenderblush":"#fff0f5", "lawngreen":"#7cfc00", "lemonchiffon":"#fffacd", "lightblue":"#add8e6", "lightcoral":"#f08080", 
	"lightcyan":"#e0ffff", "lightgoldenrodyellow":"#fafad2", "lightgrey":"#d3d3d3", "lightgreen":"#90ee90", "lightpink":"#ffb6c1", 
	"lightsalmon":"#ffa07a", "lightseagreen":"#20b2aa", "lightskyblue":"#87cefa", "lightslategray":"#778899", "lightsteelblue":"#b0c4de", 
	"lightyellow":"#ffffe0", "lime":"#00ff00", "limegreen":"#32cd32", "linen":"#faf0e6", "magenta":"#ff00ff", "maroon":"#800000", 
	"mediumaquamarine":"#66cdaa", "mediumblue":"#0000cd", "mediumorchid":"#ba55d3", "mediumpurple":"#9370d8", "mediumseagreen":"#3cb371", 
	"mediumslateblue":"#7b68ee", "mediumspringgreen":"#00fa9a", "mediumturquoise":"#48d1cc", "mediumvioletred":"#c71585", 
	"midnightblue":"#191970", "mintcream":"#f5fffa", "mistyrose":"#ffe4e1", "moccasin":"#ffe4b5", "navajowhite":"#ffdead", 
	"navy":"#000080", "oldlace":"#fdf5e6", "olive":"#808000", "olivedrab":"#6b8e23", "orange":"#ffa500", "orangered":"#ff4500", 
	"orchid":"#da70d6", "palegoldenrod":"#eee8aa", "palegreen":"#98fb98", "paleturquoise":"#afeeee", "palevioletred":"#d87093", 
	"papayawhip":"#ffefd5", "peachpuff":"#ffdab9", "peru":"#cd853f", "pink":"#ffc0cb", "plum":"#dda0dd", "powderblue":"#b0e0e6", 
	"purple":"#800080", "rebeccapurple":"#663399", "red":"#ff0000", "rosybrown":"#bc8f8f", "royalblue":"#4169e1", "saddlebrown":"#8b4513", 
	"salmon":"#fa8072", "sandybrown":"#f4a460", "seagreen":"#2e8b57", "seashell":"#fff5ee", "sienna":"#a0522d", "silver":"#c0c0c0", 
	"skyblue":"#87ceeb", "slateblue":"#6a5acd", "slategray":"#708090", "snow":"#fffafa", "springgreen":"#00ff7f", "steelblue":"#4682b4",
	"tan":"#d2b48c", "teal":"#008080", "thistle":"#d8bfd8", "tomato":"#ff6347", "turquoise":"#40e0d0", "violet":"#ee82ee", 
	"wheat":"#f5deb3", "white":"#ffffff", "whitesmoke":"#f5f5f5", "yellow":"#ffff00", "yellowgreen":"#9acd32"};

	constructor(colorString) {
		this.r = 0;
		this.g = 0;
		this.b = 0;

		this.h = 0;
		this.s = 0;
		this.l = 0;

		this.a = 1;

		if(tk.exists(colorString))
			this.parse(colorString);
	}

	static getNamed() {
		var colors = [];

		for (let colorName in tk.Color.named) 		
			colors.push({name: colorName, color: new tk.Color(colorName)});

		return colors;
	}

	static fromElementBackgroundColor(element) {
		return new tk.Color((new tk.Element(element).getComputed("background-color")));
	}

	static fromElementColor(element) {
		return new tk.Color((new tk.Element(element).getComputed("color")));
	}

	static isColor(color) {
		if (color === "" || color === "inherit" || color === "transparent") 
			return false;

		// Test if color changes from the test color
		var image = make("img");
		image.style.color = "rgb(0, 0, 0)";
		image.style.color = color;

		if (image.style.color !== "rgb(0, 0, 0)") 
			return true; 

		// Test again to account for the previously used test color
		image.style.color = "rgb(255, 255, 255)";
		image.style.color = color;

		return (image.style.color !== "rgb(255, 255, 255)");
	}

	equals(otherColor) 	{
		if(	otherColor.h == this.h 
			&& otherColor.s == this.s 
			&& otherColor.l == this.l 
			&& otherColor.a == this.a)
			return true;

		return false;
	}

	randomize()	{
		this.fromRgba(tk.random.integer(0,255),
		tk.random.integer(0,255),
		tk.random.integer(0,255),
		(tk.random.decimal(0,1)).toFixed(2));
	}

	randomizeOpaque() {
		this.fromRgba(tk.random.integer(0,255),
		tk.random.integer(0,255),
		tk.random.integer(0,255),
		1);
	}

	clone()	{
		var newColor = new tk.Color();
		newColor.fromHsla(this.h,this.s,this.l,this.a);
		return newColor;
	}

	fromRgba(r, g, b, a) {
		var hsl = this.rgbToHsl(r, g, b);
		this.r = r;
		this.g = g;
		this.b = b;

		this.h = hsl[0];
		this.s = hsl[1];
		this.l = hsl[2];

		this.a = a;
	}

	fromHsla(h, s, l, a) {
		var rgb = this.hslToRgb(h, s, l);
		this.r = rgb[0];
		this.g = rgb[1];
		this.b = rgb[2];

		this.h = h;
		this.s = s;
		this.l = l;

		this.a = a;
	}

	fromHex(hex) {
		var rgb = this.hexToRgb(hex);
		this.fromRgba(rgb[0], rgb[1], rgb[2], this.a);
	}

	parse(colorString) {
		if(colorString.startsWith("#")) {
			this.fromHex(colorString);
		} else if (tk.exists(tk.Color.named[colorString])){
			this.fromHex(tk.Color.named[colorString]);
		} else if (colorString.startsWith("hsl")) {
			var trimmed = colorString.replace("hsla(","");
			trimmed = trimmed.replace("hsl(","");
			trimmed = trimmed.replace(")","");
			trimmed = trimmed.replace("'","");
			trimmed = trimmed.replace("\"","");
			var chunks = trimmed.split(",");

			if (chunks.length == 3) // hsl
				this.fromHsla(parseInt(chunks[0]),parseInt(chunks[1]),parseInt(chunks[2]),1);
			else if (chunks.length == 4) //hsla 
				this.fromHsla(parseInt(chunks[0]),parseInt(chunks[1]),parseInt(chunks[2]),parseFloat(chunks[3]),1);
		} else if (colorString.startsWith("rgb")) {
			var trimmed = colorString.replace("rgba(","");
			trimmed = trimmed.replace("rgb(","");
			trimmed = trimmed.replace(")","");
			trimmed = trimmed.replace("'","");
			trimmed = trimmed.replace("\"","");
			var chunks = trimmed.split(",");

			if (chunks.length == 3) // rgb
				this.fromRgba(parseInt(chunks[0]), parseInt(chunks[1]), parseInt(chunks[2]), 1);
			else if (chunks.length == 4) //rgba
				this.fromRgba(parseInt(chunks[0]), parseInt(chunks[1]), parseInt(chunks[2]), parseFloat(chunks[3]), 1);

		} else {
			this.fromRgba(0,0,0,0);
		}
	}
	
	asHsla() {
		return "hsla(" + this.h.toFixed(0) + ", " + this.s.toFixed(0) + "%, " + this.l.toFixed(0) + "%, " + this.a.toFixed(2) + ")";
	}

	asRgba() {
		return "rgba(" + this.r.toFixed(0) + ", " + this.g.toFixed(0) + ", " + this.b.toFixed(0) + ", " + this.a.toFixed(2) + ")";
	}
	
	asHex()	{
		return this.rgbToHex(this.r, this.g, this.b);
	}
	
	hslToRgb(h, s, l) {
		var r, g, b;

		if(h>0) h /= 360;
		if(s>0) s /= 100;
		if(l>0) l /= 100;

		if(s == 0) {
			r = g = b = l; // achromatic
		} else {
			var hue2rgb = function hue2rgb(p, q, t) {
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	
	rgbToHsl(r, g, b) {
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if(max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return [h*360, s*100, l*100];
	}
	
	hexToHsl(hex)	{
		var rgb = this.hexToRgb(hex);
		return this.rgbToHsl(rgb[0], rgb[1], rgb[2]);
	}
	
	hexToRgb(hex)	{
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
	}
	
	hslToHex(h,s,l) {
		var rgb = this.hslToRgb(h,s,l);
		return this.rgbToHex(rgb[0], rgb[1], rgb[2]);
	}
	
	rgbToHex(r,g,b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
	
	lighter(factor) {
		var c = this.clone();
		var newl = (factor * c.l) + c.l;
		
		if (newl > 100)
			newl = 100;
		else if (newl < 0)
			newl = 0;

		c.fromHsla(c.h, c.s, newl, c.a);

		return c;
	}
	
	getLuminance() {
		var a = [this.r, this.g, this.b].map((v) => {
			v /= 255;
			return v <= 0.03928
				? v / 12.92
				: Math.pow( (v + 0.055) / 1.055, 2.4 );
		});

		return (a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722) * this.a;
	}

	contrastWith(color) {
		return (color.getLuminance() + 0.05) / (this.getLuminance() + 0.05);
	}
	
	isDark() {
		return this.contrastWith(new tk.Color("white")) > 2.5;
	}
	
	isLight() {
		return (!this.isDark());
	}
	
	isGray() {
		return (tkArray.areElementsEqual([this.r,this.g,this.b]));
	}
}

tk.Element = class {
	_base; // The html element
	_eventMaps = [];
	_children = [];

	constructor(element, options) {
		this._base = tk.exists(element) ? element : document.body; 

		if(tk.exists(options)) {
			if(tk.exists(options.className))
				this.className = options.className;

			if (tk.exists(options.attributes)) {
				var attributeNames = Object.keys(options.attributes);
				attributeNames.forEach(attributeName => 
					this._base.setAttribute(attributeName, options.attributes[attributeName]));
			}	

			if (tk.exists(options.style))
				this._base.setAttribute("style", options.style);

			if (tk.exists(options.display))
				this.display = options.display;
		}
	}

	static from(selector) {
		return new tk.Element(document.querySelector(selector));
	}

	get element() {
		return this._base;
	}

	set element(newElement) {
		this._base = newElement;
	}

	get e() {
		return this.element;
	}

	set e(newElement) {
		this.element = newElement;
	}

	on(eventName, callback) {
		var tkElement = this;

		if(tk.exists(this._eventMaps[eventName])) {
			var eventPair = this._eventMaps[eventName];
			eventPair.targetElement.addEventListener(eventPair.targetEvent, function() {
				callback(tkElement);
			});
		} else {
			this.element.addEventListener(eventName, function() {
				callback(tkElement);
			});
		}
	}

	trigger(eventName) {	
		if(tk.exists(this._eventMaps[eventName])) {
			var eventPair = this._eventMaps[eventName];
			eventPair.targetElement.dispatchEvent(new Event(eventPair.targetEvent));
		} else {
			return this.element.dispatchEvent(new Event(eventName));
		}
	}

	forEachChild(callback) {
		this._children.forEach(callback);
	}

	get style() {
		return this.element.style;
	}

	getComputed(propertyName) {
		return window.getComputedStyle(this.element, null).getPropertyValue(propertyName);
	}
	
	hasFocus() {
		return (document.activeElement == this.element);
	}

	get innerHtml() {
		return this.element.innerHTML;
	}

	set innerHtml(innerHtml) {
		this.element.innerHTML = innerHtml;
	}

	makeFullscreen() {
		if (this.element.requestFullscreen)
			this.element.requestFullscreen();
		else if (this.element.msRequestFullscreen) 
			this.element.msRequestFullscreen();
		else if (this.element.mozRequestFullScreen) 
			this.element.mozRequestFullScreen();
		else if (this.element.webkitRequestFullscreen) 
			this.element.webkitRequestFullscreen();
	}

	exitFullscreen() {
		if (document.exitFullscreen) 
			document.exitFullscreen();
		else if (document.webkitExitFullscreen)
			document.webkitExitFullscreen();
		else if (document.mozCancelFullScreen)
			document.mozCancelFullScreen();
		else if (document.msExitFullscreen) 
			document.msExitFullscreen();
	}

	isFullscreen() {
		return (document.fullscreenElement == this.element 
			|| document.mozFullScreenElement == this.element 
			|| document.webkitFullscreenElement == this.element 
			|| document.msFullscreenElement == this.element);
	}

	toggleFullscreen() {
		if (this.isFullscreen())
			this.exitFullscreen();
		else
			this.makeFullscreen();
	}

	hasAttribute(attribute) {
		return this.element.hasAttribute(attribute);
	}

	getAttribute(attribute) {
		return this.element.getAttribute(attribute);
	}

	setAttribute(attribute, value)	{
		this.element.setAttribute(attribute, value);		
	}

	removeAttribute(attribute)	{
		this.element.removeAttribute(attribute);
	}

	addAttribute(attribute) {
		this.element.setAttributeNode(document.createAttribute(attribute));
	}

	setAttributeNode(attributeNode) {
		this.element.setAttributeNode(attributeNode);
	}

	get role() {
		return this.getAttribute("role");
	}

	set role(role)	{
		this.setAttribute("role", role);
	}

	addClass(...classes)	{
		classes.forEach((className) => {
			if(!this.hasClass(className))
				this.element.classList.add(className);
		});
	}

	removeClass(...classes)	{
		classes.forEach((className) => 
			this.element.classList.remove(className));
	}

	toggleClass(...classes)	{
		classes.forEach((className) => 
			this.element.classList.toggle(className));
	}

	classAt(index) {
		return this.element.classList.item(index);
	}

	hasClass(className) {
		return this.element.classList.contains(className);
	}

	get className() {
		return this.element.className;
	}

	set className(className) {
		this.element.className = className;
	}

	add(...widgets) {		
		widgets.forEach((widget) => {			
			this.element.appendChild(widget.element);
			widget._parent = this;
			this._children.push(widget);
		});
	}

	remove(...widgets) {		
		widgets.forEach((widget) => {			
			this.element.removeChild(widget.element);
			widget._parent = null;
			tk.array.remove(this._children, widget);
		});
	}

	addElement(...elements) {
		elements.forEach((element) => {			
			this.element.appendChild(element);
		});
	}

	removeElement(...elements) {
		elements.forEach((element) => {			
			this.element.removeChild(element);
		});
	}

	clear()	{
		while (this.element.firstChild) 
			this.element.removeChild(this.element.firstChild);
	}

	/* Shorcuts to common styles so you
		can type:
		widget.color = "black";
				instead of
		widget.e.style.color = "black";
	*/
	get background() {
		return this.element.style.background;
	}

	set background(background) {
		this.element.style.background = background;
	}		
	
	get color() {
		return this.element.style.color;
	}

	set color(color) {
		this.element.style.color = color;
	}	
	
	get border() {
		return this.element.style.border;
	}

	set border(border) {
		this.element.style.border = border;
	}	
	
	get padding() {
		return this.element.style.padding;
	}

	set padding(padding) {
		this.element.style.padding = padding;
	}	
	
	get margin() {
		return this.element.style.margin;
	}

	set margin(margin) {
		this.element.style.margin = margin;
	}
	
	get display() {
		return this.element.style.display;
	}

	set display(display) {
		this.element.style.display = display;
	}

	get cursor() {
		return this.element.style.cursor;
	}

	set cursor(cursor) {
		this.element.style.cursor = cursor;
	}

	get visible() {
		return this.getComputed("display") != "none";
	}

	set visible(visible) {
		var visibleDisplay = "block";
		if(this.hasAttribute("visible-display") && this.visible) {	
			visibleDisplay = this.getAttribute("visible-display");
		} else if (this.visible) {
			var currentDisplay =  this.getComputed("display");
			this.setAttribute("visible-display", currentDisplay);
			visibleDisplay = currentDisplay;
		}

		if(visible)
			this.display = visibleDisplay;
		else 
			this.display = "none";
	}
} 

tk.View = class extends tk.Element {
	constructor(title, options) {
		super(document.body, options);

		if(tk.exists(title))
			this.title = title;

		// Events
		this._eventMaps["loaded"] = new tk.EventPair(document, "DOMContentLoaded");

	}

	/*
		Events:
		Loaded
		Closing
		Resize
		Fullscreen
	 */

	whenReady(callback) {
		if (this.hasLoaded) {
			callback();
		} else {
			document.addEventListener("DOMContentLoaded", callback);
		}
	}

	onExit(callback) {
		
	}

	get hasLoaded () {
		return document.readyState === "complete" 
			|| (document.readyState !== "loading" && !document.documentElement.doScroll);
	}

	get title()	{
		return document.title;
	}
	
	set title(title) {
		document.title = title;
	}

	get appIcon() {

	}

	set appIcon(appIcon) {

	}

	get icon()	{

	}
	
	set icon(icon) {

	}

	buildUrl(urlBase, args, values) {
		let url = urlBase + "?";
		let max = Math.min(args.length, values.length);

		for(var i=0; i<max; i++) {
			url += args[i] + "=" + values[i];
			if (i < max-1) url += "&";
		}

		return url;
	}

	parseUrl(name, url) {
		if (!url)
			url = window.location.href;
		
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);

		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	getParameter(name)	{
		return this.parseUrl(name, this.getUrl());
	}
				
	getUrl() {
		return window.location.href;
	}

	// Return a list of all stylesheets
	getStylesheets() {

	}

	addStylesheet(...stylesheets) {

	}

	removeStylesheet(...stylesheets) {

	}

	clearStylesheets(removeTamarackCss) {

	}

	hasStylesheet(stylesheet) {

	}

	// <style>
	addStyle(...styles) {

	}

	removeStyle(...styles) {

	}

	// <script>
	addScript(...scripts) {

	}

	removeScript(...scripts) {

	}

	// tk.Size
	getSize() {

	}

}

tk.Widget = class extends tk.Element {	
	_parent; // The parent tk.Element of a tk.Widget

	constructor(tag, options) {
		super(tk.make(tk.fallback(tag, "div")), options);
		if(tk.exists(options)) {
			if(tk.exists(options.parent))
				options.parent.add(this);
		}
	}	

	getParent() {
		return this._parent;
	}
	
	getParentElement() {
		return this.element.parentNode;
	}

	addToElement(destinationElement) {
		destinationElement.appendChild(this.element);
	}

	addTo(destinationWidget) {
		destinationWidget.add(this); 
	}

	removeFromElement(destinationElement) {
		destinationElement.removeChild(this.element);
	}

	removeFrom(destinationWidget) {
		destinationWidget.remove(this);
	}

	delete() {
		if(this._parent)
			this._parent.remove(this);
	}

	get tooltip() {
		// TODO: PopperJs
		return "";
	}

	set tooltip(tooltipWidget) {
		// TODO: PopperJs
	}
}

tk.Text = class extends tk.Widget {
	constructor(tag, text, options) {
		super(tag, options);
		this.textNode = document.createTextNode(tk.fallback(text, ""));
		this.element.appendChild(this.textNode);
	}

	get text() {
		return this.textNode.nodeValue;
	}
	
	set text(value) {
		this.textNode.nodeValue = value;
	}
}

tk.Label = class extends tk.Widget {
	constructor(text, iconImage, options) {
		super("div", options);
		this.addClass("tkLabel");
		this.icon = new tk.Image(iconImage, {parent: this});
		this.caption = new tk.Text("span", text, {parent: this});
	}
}

tk.Link = class extends tk.Text {
	constructor(text, url, options) {
		super("a", text, options);		
		this.url = tk.fallback(url, "#");		
	}

	get url() {
		return this.getAttribute("href");
	}

	set url(url) {
		this.setAttribute("href", url);
	}
}

tk.Panel = class extends tk.Widget {
	constructor(options) {
		super("div", options);
	}
}

tk.ButtonPanel = class extends tk.Panel {
	constructor(options) {
		super(options);
		this.addClass("tkButtonPanel");
	}
}

tk.Page = class {
	constructor(title, buttonOptions, contentOptions) {
		this.tab = new tk.Button(title, buttonOptions);
		this.tab.associatedPage = this;

		this.content = new tk.Panel(contentOptions);
		this.content.associatedPage = this;
	}
	
	get title() {
		return this.tab.text;
	}
	
	set title(text) {
		this.tab.text = text;
	}

	get hidden() {

	}

	set hidden(hidden) {

	}
	
	get disabled() {

	}

	set disabled(disabled) {

	}

	get icon() {
		return this.tab.icon;
	}

	set icon(icon) {
		this.tab.icon = icon;
	}

	get activated() {
		return this.tab.hasClass("active");
	}

	set activated(activated) {
		if(activated) {
			this.tab.addClass("active");
			this.content.visible = true;
		} else {
			this.tab.removeClass("active");
			this.content.visible = false;
		}
	}
}

tk.Notebook = class extends tk.Widget {
	constructor(options) {
		super("div", options);
		this.addClass("tkNotebook");

		this.tabArea = new tk.Panel({
			parent: this, 
			className: "tkNotebookTabArea"
		});

		this.contentArea = new tk.Panel({
			parent: this, 
			className: "tkNotebookContentArea"
		});

		/*	Whether or not to wrap around when the
		end of index is reached*/
		this.wrap = tk.fallback(options.wrap, true);

		/* Whether to jump to a newly added tab */
		this.newestTabActive = tk.fallback(options.newestTabActive, false);
		
		this.pages = [];
		this.activeIndex = 0;	
	}
	
	addPage(...pages) {
		pages.forEach((page) => {
			this.pages.push(page);

			page.tab.addTo(this.tabArea);
			page.content.addTo(this.contentArea);

			if (this.newestTabActive || this.active === undefined) {
				this.active = page;
			} else {
				page.activated = false;
			}

			let notebook = this;
			page.tab.on("click", (tab) => {
				notebook.active = tab.associatedPage;
			});
		});
	}
	
	removePage(...pages) {		
		pages.forEach((page) => {
			let oldActiveIndex = this.activeIndex;

			page.tab.removeFrom(this.tabArea);
			page.content.removeFrom(this.contentArea);
			this.pages.splice(this.pages.indexOf(page), 1);

			this.activeIndex = Math.max(0, oldActiveIndex - 1);
		});
	}	

	clear() {
		while(this.pageCount > 0)
			this.removePage(this.pages[this.pages.length - 1]);
	}

	get active() {
		return this.pages[this.activeIndex];
	}

	set active(page) {
		if(!tk.exists(page))
			return;

		// Unselect the old tab, if it exists, if none has been selected
		// make sure every one remains unselected
		let oldActive = this.active;
		if(tk.exists(oldActive)) {
			oldActive.activated = false;
		} else {
			this.pages.forEach(page => page.activated = false);
		}

		// Select the new tab
		page.activated = true;

		// Trigger the activeChanged event
		this.trigger("activeChanged");
	}
	
	get activeIndex() {
		let index = -1;

		this.tabArea.forEachChild((tab, i) => {
			if(tab.hasClass("active"))
				index = i;
		});

		return index;
	}
	
	set activeIndex(index) {
		this.active = this.pages[index];
	}
	
	indexOf(page) {
		return this.pages.indexOf(page);
	}

	get pageCount() {
		return this.pages.length;
	}

	get lastPageIndex() {
		if (this.activeIndex - 1 < 0 && this.wrap)
			return this.pages.length-1;
		else
			return  Math.max(0, this.activeIndex - 1);	
	}

	get nextPageIndex() {
		if (this.activeIndex + 1 >= this.pages.length && this.wrap)
			return 0;
		else
			return Math.min(this.pages.length-1, this.activeIndex + 1);	
	}
	
	goBack() {
		this.activeIndex = this.lastPageIndex;
	}
	
	goNext() {
		this.activeIndex = this.nextPageIndex;
	}

	goToFirst() {
		this.activeIndex = 0;
	}

	goToLast() {
		this.activeIndex = this.pages.length - 1;
	}
}

tk.NotebookMenuPage = class extends tk.Page {
	constructor(title, buttonOptions, contentOptions) {
		super(title, buttonOptions, contentOptions);
	}

}

tk.NotebookMenu = class extends tk.Notebook {
	constructor(options) {
		super(options);
		this.addClass("tkNotebookMenu");
	}
}

tk.Layout = class extends tk.Widget {
	constructor(options) {
		super("div", options);

		this.direction = tk.fallback(options.direction, tk.LayoutDirection.VERTICAL);		
		this.resizable = tk.fallback(options.resizable, false);
		this.panels = tk.fallback(options.panels, []);		
		this.addClass("tkLayout");
	}

	get direction() {
		if(this.hasClass("tkLayoutHorizontal"))
			return tk.LayoutDirection.HORIZONTAL;
		
		return tk.LayoutDirection.VERTICAL;
	}

	set direction(layoutDirection) {
		this.removeClass("tkLayoutHorizontal", "tkLayoutVertical");

		if(layoutDirection == tk.LayoutDirection.HORIZONTAL)
			this.addClass("tkLayoutHorizontal");
		else if(layoutDirection == tk.LayoutDirection.VERTICAL)
			this.addClass("tkLayoutVertical");
	}

	get resizable() {

	}

	set resizable(resizable) {

	}

	get panels() {

	}

	set panels(panels) {

	}
}

tk.Button = class extends tk.Text {
	constructor(text, options) {
		super("button", text, options);
		this.setAttribute("type", "button");
	}
}

// Used for both context and menu bars
tk.Menu = class extends tk.Widget {

}

// TextArea
tk.Edit = class extends tk.Widget {

}

// .group represents a group 
tk.Radio = class extends tk.Widget {

}

tk.Check = class extends tk.Widget {

}

tk.ListBox = class extends tk.Widget {

}

tk.GroupBox = class extends tk.Widget {

}

tk.ColorButton = class extends tk.Widget {

}

tk.Canvas = class extends tk.Widget {

}

tk.Slider = class extends tk.Widget {

}

tk.Input = class extends tk.Widget {

}

// Dialogs
tk.Dialog = class extends tk.Widget {

}

tk.ColorDialog = class extends tk.Dialog {

}

tk.FontDialog = class extends tk.Dialog {

}

tk.AboutDialog = class {
	static show() {

	}
}


// Media
tk.Image = class extends tk.Widget {
	constructor(source, options) {
		super("img", options);

		if(tk.exists(source))
			this.source = source;
	}
	
	// Image source
	get source() {
		return this.element.src;
	}

	set source(source) {
		this.element.src = source;
	}
	
	// Image alternative text
	get alt() {
		return this.element.alt;
	}

	set alt(alt) {
		this.element.alt = alt;
	}
}

tk.MediaPlayer = class extends tk.Widget {

}

tk.AudioPlayer = class extends tk.MediaPlayer {

}

tk.VideoPlayer = class extends tk.MediaPlayer {

}

// Status 
tk.Progress = class extends tk.Widget {

}

tk.Meter = class extends tk.Widget {

}