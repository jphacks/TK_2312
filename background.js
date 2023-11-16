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
  const texts = splitJapaneseText(info.selectionText.replace(/%/g,"パーセント"), 5000);
  const url = await getURL();
  let message = "app.html?i=" + texts.length;
  for (let i = 0; i < texts.length; i++) {
    message += "&data" + i + "=" + texts[i];
  }
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
}

function splitJapaneseText(text, maxLength) {
  if (typeof text !== 'string' || text.length <= maxLength) {
    return [text]; // 文字列が指定の長さ以下の場合、そのまま返す
  }

  const sentences = text.split('。'); // 文章ごとに分割
  let currentChunk = ''; // 現在のチャンク
  const chunks = [];

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxLength) {
      currentChunk += sentence + '。';
    } else {
      chunks.push(currentChunk);
      currentChunk = sentence + '。';
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}