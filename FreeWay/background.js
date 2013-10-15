chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {
    bounds: {
      top: 0,
      left: 0,
      width: 720,
      height: 600
    }
  });
})
