chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: "analyze",
    title: "利用規約を解析する",
    type: 'normal',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async(info, tab) => {
  const tld = info.menuItemId;
  if(tld!="analyze") return;
  let text = info.selectionText.replace(/%/g,"パーセント");
  console.log(text);
  const url = await getURL();
  let message = "app.html?data=" + text;
  message += "&URL=" + url;
  chrome.windows.create({
    url: chrome.runtime.getURL(message),
    type: "popup"
  }, function(newWindow) {
    chrome.windows.update(newWindow.id, {
      width: 650,
      height: 750
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
};