console.log("hello");
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("received");
    if (request == "analyze") {
        const str = window.getSelection().toString();
        return new Promise((resolve, reject) => {
          console.log(str)
          resolve(str);
        });
    }
    return true;
  });
