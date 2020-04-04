# Tamarack
Tamarack is collection of modern, easy to use JavaScript classes for designing rich user interfaces, working with color, and many other useful functions. It has no dependencies (jQuery free!) other than a modern browser (so no IE support).

- **core.js:** Contains functionality used by all of the other scripts
- **color.js:** A class to make it simple to manage nearly every type of CSS color and easily convert between them: hex, hex w/ alpha, named CSS, HSL, HSLA, RGB, RGBA colors. Useful for building color pickers or other things that involve manipulating color.
- **font.js:** (TODO) A class to make it simple to manage fonts.
- **widgets.js:** Contains a collection of widgets, or wrappers for HTML elements that inherit from a class called 'TkWidget' that can be entirely manipulated through JavaScript, requiring no HTML boilerplate.

Widgets 
-------
***widgets.js*** is a collection of widgets which are wrappers around HTML elements, such as TkButton, which wraps around &lt;button&gt; or TkImage, which wraps around &lt;img&gt;. All of these widgets inherit from TkWidget, which provides them with basic functionality such as making the widget full-screen, adding/removing child widgets, attaching/triggering events, and other functionality. In addition, there are also composite widgets that represent multiple html elements in one single class, cutting down the need for massive amounts of boilerplate code for simple tasks. One of these is TkNotebook, which provides a notebook widget with tab pages that can be added and removed.

Examples 
-------
**Hello world:**
```javascript
let helloWorld = new TkText("p", { parent: "body", text: "Hello World!" });
```

(The content below DOES NOT reflect the current version, which has been completely redesigned)   
**Add progress bars:**
```javascript
var view = new tk.View("Progress Demo", { padding: "1rem" });
view.add(new tk.Progress(10), new tk.Progress(25), new tk.Progress(50), new tk.Progress(100));
```
![Progress Bars](examples/screenshots/Progress.gif)

**Create a button that makes the video fullscreen when clicked:**
```javascript
var doc = new tkDocument();
var btnFullscreen = new tkButton("Go Fullscreen");
btnFullscreen.on("click", function() { 
   video.makeFullScreen();
});
doc.add(btnFullscreen);
```

**Create a two page notebook:**
```javascript
var doc = new tkDocument();
var notebook = new tkNotebook();

var page1 = new tkNotebookPage("Page 1", "page1");
page1.content.addElement(say("Hello"));

var page2 = new tkNotebookPage("Page 2", "page2");
page2.content.addElement(say("World!"));

notebook.addPages(page1,page2);
doc.add(notebook);
```
![Notebook](examples/screenshots/Tabs.gif)

**Show a yes/no dialog:**
```javascript
var doc = new tkDocument("Dialog Demo");
doc.padding = "1rem";

var dialogButton = new tkButton("Show Dialog");
doc.add(dialogButton);

dialogButton.on("click", function() {
	tkDialog.show("Welcome to tamarack! Do you like this demo?", "Some Dialog", [tkDialogResult.YES, tkDialogResult.NO], (dialogResult) => {
		if (dialogResult == tkDialogResult.YES)
			tkDialog.show("Thanks!");
		else
			tkDialog.show("Well then...");
	});
});
```
![Dialog](examples/screenshots/SimpleDialog.gif) 

**Set the background from a color dialog:**
```javascript
var doc = new tkDocument();
var dlgColor = new tkColorDialog();

dlgColor.show((dialogResult) => {
    if (dialogResult == tkDialogResult.OK)
        doc.setBackgroundColor(dlgColor.color.getHslaString());
});
```
![Color Dialog](examples/screenshots/ColorDialog.gif)
