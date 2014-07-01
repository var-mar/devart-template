chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("index.html",
    {
       id: "wishing-wall-server",
       minWidth:1920,
       minHeight: 1200,
       left:0,
       top:0
    },function(appwindow){
      appwindow.setAlwaysOnTop(true);
      appwindow.focus();
      appwindow.setBounds({left:0,top:0,width:1920,height:1200});
      appwindow.fullscreen();
  });
});

