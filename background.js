
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
  var getSelectText = info.selectionText;
  let rtnPromise = chrome.tabs.sendMessage(tab.id, "analyze");
  rtnPromise
   .then((response)=> {
        // コールバック関数の処理
        //nop
   })
   .catch((error)=> {
        // エラー処理
        //nop
   });
});

