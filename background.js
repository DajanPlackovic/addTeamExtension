const injectedTabs = new Set();

chrome.action.onClicked.addListener(async (tab) => {
  injectedTabs.add(tab.url);
  console.log(injectedTabs);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ADDING_COMPLETE") {
    injectedTabs.delete(message.url)
  }
  sendResponse({ status: "success", receivedAt: new Date().toISOString() });
})
