# Tamarack
An easy to use JavaScript library that can create, modify, and style HTML through ECMAScript 6 classes. The backbone of [Socorro Designer](https://github.com/ianmartinez/Socorro-Designer), a user interface designer that outputs content that can be modified dynamically using this library.

Examples
-------
**Add HTML5 video:**
```javascript
var video = new tkVideo();
video.source = "video_source.mp4";
video.addToElement(document.body);
```

**Create a button that makes the video fullscreen when clicked:**
```javascript
var btnFullscreen = new tkButton();
btnFullscreen.text = "Go Fullscreen";				
btnFullscreen.element.onclick = () => vid.makeFullScreen();
btnFullscreen.addToElement(document.body);
```


**Create a two page notebook:**
```javascript
var notebook = new tkNotebook();

var page1 = new tkNotebookPage("Page 1", "page1");
page1.addContent(say("Hello"));

var page2 = new tkNotebookPage("Page 2", "page2");
page2.addContent(say("World!"));

notebook.addPages(page1,page2);
notebook.addToElement(document.body);
```

**Show a yes/no dialog: (Coming Soon)**
```javascript
var dlgMessage = new tkDialog();

dlgMessage.choices = [tkDialogResult.YES, tkDialogResult.NO];
dlgMessage.addContent(say("Do you like this demo?"));

dlgMessage.show((dialogResult) => {
    alert(dialogResult);
});
```

**Set the background from a color dialog: (Coming Soon)**
```javascript
var dlgColor = new tkColorDialog();

dlgColor.show((dialogResult) => {
    if (dialogResult == tkDialogResult.OK)
        doc.backColor = dlgColor.color;
});
```

**Initialize a property panel to modify an object: (Coming in a later version)**
```javascript
var prop = new tkPropertyPanel();
var button = new tkButton();

prop.associatedControl = button;

prop.addToElement(document.body);
button.addToElement(document.body);
```