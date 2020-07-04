# Tamarack
Tamarack is collection of modern, easy to use JavaScript classes for designing rich user interfaces, working with color, and many other useful functions. It has no dependencies (jQuery free!) other than a modern browser (so no IE support).

- **core.js:** Contains functionality used by all of the other scripts
- **color.js:** A class to make it simple to manage nearly every type of CSS color and easily convert between them: hex, hex w/ alpha, named CSS, HSL, HSLA, RGB, RGBA colors. Useful for building color pickers or other things that involve manipulating color.
- **font.js:** A class to make it simple to manage fonts.
- **views.js:** Contains a collection of views, or wrappers for HTML elements that inherit from a class called 'TkView' that can be entirely manipulated through JavaScript, requiring no HTML boilerplate.

Views 
-------
***views.js*** is a collection of views which are wrappers around HTML elements, such as TkButton, which wraps around &lt;button&gt; or TkImage, which wraps around &lt;img&gt;. All of these widgets inherit from TkView, which provides them with basic functionality such as making the view full-screen, adding/removing child views, attaching/triggering events, and other functionality. In addition, there are also composite views that represent multiple html elements in one single class, cutting down the need for massive amounts of boilerplate code for simple tasks. One of these is TkNotebook, which provides a notebook widget with tab pages that can be added and removed.

Examples 
-------
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
