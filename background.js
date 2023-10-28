chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.removeAll(function() {
      chrome.contextMenus.create({
        title: "危ない利用規約はどれかな？",
        id: "askGPT",
        contexts: ["selection"],
      });
      chrome.contextMenus.create({
        title: "どれが危ないかな？条約を教えてあげよう",
        parentId: "askGPT",
        id: "jp_riyoukiyaku",
        contexts: ["selection"],
      });
      chrome.contextMenus.create({
        title: "Extract potentially dangerous clauses",
        parentId: "askGPT",
        id: "en_riyoukiyaku",
        contexts: ["selection"],
      });
      chrome.contextMenus.create({
        title: "Quick Reply",
        parentId: "askGPT",
        id: "quickReply",
        contexts: ["selection"],
      });
    });
  });

chrome.contextMenus.create({
  id: 'translate',
  title: 'Translate selected text',
  contexts: ['selection'],
});

  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "jp_riyoukiyaku") {
      openPopupWithQuestion("以下の利用規約のうち，危ないと思われる条項を抜き出してください．箇条書きでお願いします,", info.selectionText);
    } else if (info.menuItemId === "en_riyoukiyaku") {
      openPopupWithQuestion("Please provide the text of the terms of use you would like me to translate and extract potentially dangerous clauses from., ", info.selectionText);
    } else if (info.menuItemId === "quickReply") {
      openPopupWithQuestion("Provide a good quick reply to this, ", info.selectionText);
    }
  });
  
  function openPopupWithQuestion(prompt, selectedText) {
    chrome.storage.local.set({question: prompt + selectedText}, function() {
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup"
      }, function(newWindow) {
        chrome.windows.update(newWindow.id, {
          width: 590,
          height: 645
        });
      });
    });
  }
  

  chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === "popup") {
        port.onMessage.addListener(function(msg) {
            if (msg.action === "getQuestion") {
                chrome.storage.local.get("question", function(data) {
                    port.postMessage({action: "setQuestion", question: data.question});
                });
            }
        });
    }
});

