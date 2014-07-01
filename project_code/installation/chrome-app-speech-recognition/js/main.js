/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    id: 'speak your wish',
    bounds: {
      width: 360,
      height: 800
    },
    "resizable":false
  },function(){
  	appwindow.setMinimumSize({minWidth: 360,minHeight: 800});
  	appwindow.setAlwaysOnTop(true);
  });
});
