function showWelcome(info, tab) {
	let url = chrome.runtime.getURL("welcome.html");
	chrome.tabs.create({ url });
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    showWelcome();
  }
});

chrome.action.onClicked.addListener((tab) => {
  showWelcome();
});

chrome.runtime.onMessage.addListener(({ action, url }) => {
  if (action === "CREATE_INCOGNITO_WINDOW") {
    chrome.storage.local.get(["window_id"], (result) => {
      if (result.window_id == null) {
        chrome.windows.create({
          url,
          focused: true,
          incognito: true 
        }, (window) => {
					chrome.storage.local.set({ "window_id": window.id });
				});
      } else {
      	chrome.tabs.create({
					url: url,
					windowId: result.window_id 
				});
			}
    });
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
	chrome.storage.local.get(["window_id"], (result) => {
		if (result.window_id == windowId) {
			chrome.storage.local.set({ "window_id": null });
		}
	});	
});

