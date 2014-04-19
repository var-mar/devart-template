chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("http://localhost:8000/screen1.html",
    {  frame: "none",
       id: "renderWin1",
       bounds: {
         width: 1920,
         height: 1080,
         left: 0
       },
       minWidth: 1920,
       minHeight: 1080
    }
  );
});
