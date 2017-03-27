# Tamarack
An easy to use JavaScript library that can create, modify, and style HTML through ECMAScript 6 classes. The backbone of [Socorro Designer](https://github.com/ianmartinez/Socorro-Designer), a user interace designer that outputs content that can be modified dynamically using this library.

Examples
-------
**Add HTML5 video:**
```javascript
var video = new tkVideoPlayer();
video.source = "video_source.mp4";
video.addToElement(document.body);
```

**Create a button that makes the video fullscreen when clicked:**
```javascript
var btnFullscreen = new tkButton();
btnFullscreen.text = "Go Fullscreen";				
btnFullscreen.element.onclick = () => vid.makeFullScreen();
```


**Create a two page notebook:**
```javascript
var notebook = new tkNotebook();

var page1 = new tkNotebookPage();
page1.title = "Page 1";
page1.content = "Hello";

var page2 = new tkNotebookPage();
page2.title = "Page 2";
page2.content = "World";

notebook.addPages(page1,page2);
notebook.addToElement(document.body);
```
