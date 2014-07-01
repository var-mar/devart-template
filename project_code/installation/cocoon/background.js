chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("index.html",
    {  frame: "none",
       id: "wishing-wall-cocoon-screen",
//       alwaysOnTop:true,
       minWidth:1920,
       minHeight: 1200,
       left:0,
       top:0,
        focused:true
    },function(appwindow){
      appwindow.setAlwaysOnTop(true);
      appwindow.focus();
      appwindow.setBounds({left:1920,top:-50});
      appwindow.fullscreen();
  });
});

