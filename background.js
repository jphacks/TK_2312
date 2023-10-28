
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
  console.log(getSelectText)
});

// async function callContent(){
//   let value = await chrome.tabs.sendMessage(tab.id, "analyze",(response)=>{
//     resolve(response)
//   });
//   console.log(value);
//   rtnPromise
//    .then((response)=> {
//         // コールバック関数の処理
//         //nop
//         console.log(response)
//         chrome.windows.create({
//           url: chrome.runtime.getURL("popup.html"),
//           type: "popup"
//         }, function(newWindow) {
//           chrome.windows.update(newWindow.id, {
//             width: 590,
//             height: 645
//           });
//         });
//    })
//    .catch((error)=> {
//         // エラー処理
//         //nop
//    });
// }

