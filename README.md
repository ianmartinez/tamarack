# Tamarack
An easy to use JavaScript library that can create, modify, and style HTML through ECMAScript 6 classes. The backbone of [Socorro Designer](https://github.com/ianmartinez/Socorro-Designer), a user interace designer that outputs content that can be modified dynamically using this library.

For example to add a video and show its controls all you have to do is type:
```javascript
var video = new tkVideoPlayer("video");
video.source = "video_source.mp4";
video.addToElement(document.body);
```
