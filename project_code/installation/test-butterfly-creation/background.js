chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("server.html",
    {
    frame: "none",
       id: "wishing-wall-stress-test",
       minWidth:300,
       minHeight: 300,
       left:0,
       top:0
    },function(appwindow){
       appwindow.setBounds({left:0,top:50,width:300,height:300});
  });
});

