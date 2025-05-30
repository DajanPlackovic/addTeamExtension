// const tracker = {
//   tabIds: new Set(),
//   addTabId: function(tabId) {
//     this.tabIds.add(tabId);
//     setTimeout(function () {
//       this.tabIds.remove(tabId);
//     }, 1000)
//   }
// }

chrome.action.onClicked.addListener(async (tab) => {
  console.log(`did the thing`);
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "ADDING_COMPLETE") {
//     completed.add(message.url)
//     console.log(completed);
//   }
//   sendResponse({ status: "success", receivedAt: new Date().toISOString() });
// })
