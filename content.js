console.log("hello");
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("received");
    if (request == "analyze") {
        const str = window.getSelection()
        console.log(str);
        alert(str);
    }
    return true;
  });

  function openDialog() {
    chrome.windows.create({

    })
  }
