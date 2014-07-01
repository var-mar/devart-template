chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("flocking_nongpu.html",
    {  frame: "none",
       id: "wishing-wallscreens",
       alwaysOnTop:true,
       minWidth:1920,
       minHeight: 1200,
       left:0,
       top:0
    },function(appwindow){
      appwindow.setAlwaysOnTop(true);
      appwindow.focus();
       appwindow.setBounds({left:1920,top:-50,width:1920,height:1200});
       //appwindow.fullscreen();
  });
});

