function showPopup() {
	let url = chrome.runtime.getURL("popup.html");
	chrome.tabs.create({ url });
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 1, 
          action: { 
            type: "redirect",
            redirect: {
              url: "https://google.com/gen_204"
            } 
          },
          condition: {
            urlFilter: "medium.com",
            resourceTypes: [
              "main_frame"
            ]
          }
        }
      ],
      removeRuleIds: [1]
    });
    showPopup();
  }
});

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  chrome.windows.create({ url: info.request.url, incognito: true });
});
