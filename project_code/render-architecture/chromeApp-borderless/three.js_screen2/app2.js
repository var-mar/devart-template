chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("../../node-server-webgl/public/render2.html",
    {  frame: "none",
       id: "renderWin2",
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
