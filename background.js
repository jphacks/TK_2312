
chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "analyze",
    title: "Analyze ToS",
    type: 'normal',
    contexts: ['selection']
  });
  console.log("created")
});

chrome.contextMenus.onClicked.addListener(async(info, tab) => {
  console.log("ffff")
  const tld = info.menuItemId;
  if(tld!="analyze") return;
  const text = info.selectionText;
  const url = await getURL();
  console.log(url)
  chrome.windows.create({
    url: chrome.runtime.getURL(`popup.html?data=${text}&URL=${url}`),
    type: "popup"
  }, function(newWindow) {
    chrome.windows.update(newWindow.id, {
      width: 590,
      height: 645
    });
  });
});

async function getURL() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      const currentUrl = currentTab.url;
      resolve(currentUrl);
    });
  });
}