# Tamarack
Tamarack is collection of modern, easy to use JavaScript classes for designing rich user interfaces, working with color, and many other useful functions It has no dependencies (jQuery free!) other than a modern browser (so no IE support). Think of it as an AppKit, GTK, or QT, but for the web. Because tamarack takes care of the UI part of your app, you can focus solely app-specific features.    
    
Here are some of the things tamarack supports:    
* Modern design, using ES6 classes and the latest JS features    
* 30+ views inheriting from the TkView base class   
* Automatic dark mode support    
* Desktop-class color and font support with TkColor, TkColorChooser, TkFont, and TkFontChooser    
* Easy integration with existing apps   
* Styled with CSS variables so that the default colors can easily be overriden     


**Note: Tamarack is still under development, so it isn't quite ready to be used in production.**

## Examples
The [Gradient Maker App](https://github.com/ianmartinez/tamarack/blob/master/examples/apps/gradient-maker.html) provides a good starting point for using tamarack. In about 90 lines of code, it provides a UI for building a CSS gradient with options for editing the angle and for adding, editing, and removing colors:     
![Gradient Maker](https://raw.githubusercontent.com/ianmartinez/tamarack/master/screenshots/GradientMakerModes.jpg?raw=true)

Another good starting point for cross-platform web apps is the [Detect Target App](https://github.com/ianmartinez/tamarack/blob/master/examples/apps/detect-target.html), which shows how to implement target-specific styles and detect the current app target in JavaScript. 
![Target Detector](https://raw.githubusercontent.com/ianmartinez/tamarack/master/screenshots/Targets.jpg?raw=true)

## Files   
- **core.js:** Contains functionality used by all of the other scripts
- **color.js:** A class to make it simple to manage nearly every type of CSS color and easily convert between them: hex, hex w/ alpha, named CSS, HSL, HSLA, RGB, RGBA colors. Useful for building color pickers or other things that involve manipulating color.
- **font.js:** A class to make it simple to manage fonts.
- **view.js:** Contains a collection of views, or wrappers for HTML elements that inherit from a class called 'TkView' that can be entirely manipulated through JavaScript, requiring no HTML boilerplate.

## Views   
***view.js*** is a collection of views which are wrappers around HTML elements, such as TkButton, which wraps around &lt;button&gt; or TkImage, which wraps around &lt;img&gt;. All of these widgets inherit from TkView, which provides them with basic functionality such as making the view full-screen, adding/removing child views, attaching/triggering events, and other functionality. In addition, there are also composite views that represent multiple html elements in one single class, cutting down the need for massive amounts of boilerplate code for simple tasks. One of these is TkNotebook, which provides a notebook widget with tab pages that can be added and removed.

## Examples   
**Hello world:**
```javascript
new TkText("p", { parent: "body", text: "Hello World!" });
```

**Interacting with plain HTMLElements:**   
While you can build your entire application in nothing but tamarack, tamarack works
cleanly with other components in webpages, such as HTMLElements and CSS selectors for them:
```javascript
// Add a TkView as a child of an HTMLElement with the id "someElement"
new TkText("p", { parent: "#someElement", text: "An HTMLElement is my parent" });

// Add an element with the id "someOtherElement" as a child of a TkView:
new TkView({ parent: "body", children: ["#someOtherElement"] });
```
        
**Add progress bars:**
```javascript
for(let i of [0, 25, 50, 75, 100])
   new TkProgress({ parent: "body", value: i });
```
     
**Create a button that makes a video fullscreen when clicked:**
```javascript
let fullscreenButton = new TkButton({ parent: "body", text: "Go Fullscreen" });
let video = new TkVideo({ parent: "body" });
fullscreenButton.on("click", () => video.isFullscreen = true);
```
     
**Create a two page notebook:**
```javascript
let notebook = new TkNotebook({ parent: "body" });

let page1 = new TkNoteBookPage({ 
   parent: notebook, 
   title: "Hello",
   content: [new TkText("p", { text: "Hello" })]
});

let page2 = new TkNoteBookPage({ 
   parent: notebook, 
   title: "World",
   content: [new TkText("p", { text: "World" })]
});
```

See more examples [here](https://ianmtz.com/Tamarack)
