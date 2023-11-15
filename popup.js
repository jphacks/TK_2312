main();

async function main()
{
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	$('.jatoen').click(function() {
		$('.ja').hide();
		$('.en').show();
	});
	$('.entoja').click(function() {
		$('.en').hide();
		$('.ja').show();
	});
	$('.start').click(function() {
		$('.first').hide();
		chrome.scripting.executeScript({
			target:{tabId:tab.id},
			files: ["styleScript/jquery-3.5.1.min.js","readHtml.js"]
		},
		async function(){
			let defaultHTML = await chrome.scripting.executeScript({
				target:{tabId:tab.id},
				function: function(){
					return document.body.innerHTML;
				}
			});
			let text = await chrome.scripting.executeScript({
				target:{tabId: tab.id},
				function: function(){
					return pickUp();
				}
			});
			$('.second').show();
			$('.cancel').click(function() {
				chrome.scripting.executeScript({
					target:{tabId: tab.id},
					function: function(defaultHTML){
						document.body.innerHTML = defaultHTML;
					},
					args: [defaultHTML[0].result]
				});
				$('.second').hide();
				$('.third').show();
			});
			$('.ok').click(async function() {
				chrome.scripting.executeScript({
					target:{tabId: tab.id},
					function: function(defaultHTML){
						document.body.innerHTML = defaultHTML;
					},
					args: [defaultHTML[0].result]
				});
				const url = await getURL();
				chrome.windows.create({
					url: chrome.runtime.getURL(`app.html?data=${text[0].result}&URL=${url}`),
					type: "popup"
				}, function(newWindow) {
					chrome.windows.update(newWindow.id, {
						width: 650,
						height: 750
					});
				});
				window.close();
			});
			$('.close').click(function() {
				window.close();
			});
		});
	});
}

async function getURL() {
	return new Promise((resolve, reject) => {
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			const currentTab = tabs[0];
			const currentUrl = currentTab.url;
			resolve(currentUrl);
		});
	});
}