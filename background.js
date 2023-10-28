
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "analyze",
    title: "Analyze ToS",
    type: 'normal',
    contexts: ['selection']
  });
  console.log("created")
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("ffff")
  const tld = info.menuItemId;
  if(tld!="analyze") return;
  const text = info.selectionText;
  console.log('popup.html?data=${text}');
  chrome.windows.create({
    url: chrome.runtime.getURL(`popup.html?data=${text}`),
    type: "popup"
  }, function(newWindow) {
    chrome.windows.update(newWindow.id, {
      width: 590,
      height: 645
    });
  });
});