chrome.action.onClicked.addListener((tab) => {
  if (tab.id && tab.url) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['script.js'],
    });
  }
});
