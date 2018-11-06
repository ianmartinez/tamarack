# Tamarack
An easy to use JavaScript library that can create, modify, and style HTML through ECMAScript 6 classes. It is designed to be used in Electron apps, but works well for browser apps as well.
 
Architecture 
-------
Most of Tamarack is a collection of widgets that provide a wrapper around html elements, such as tkButton, which wraps around &lt;button&gt; or tkImage, which wraps around &lt;img&gt;. All of these widgets inherit from tkWidget, which provides them with basic functionality such as making the element full-screen or adding the widget to another widget. In addition, there are also composite widgets, such as tkNotebook and tkDialog, that represent multiple html elements in one single class, cutting down the need for massive amounts of boilerplate code for simple tasks.

Examples
-------
**Add progress bars:**
```javascript
var doc = new tkDocument("Progress Demo");
doc.padding = "1rem";
			 
doc.add(new tkProgress(10), new tkProgress(25), new tkProgress(50), new tkProgress(100));
```
![Progres Bars](examples/screenshots/Progress.gif)

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
        doc.setBackgroundColor(dlgColor.color.getHslaCss());
});
```
![Color Dialog](examples/screenshots/ColorDialog.gif)
