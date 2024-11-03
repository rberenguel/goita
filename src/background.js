chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureVisibleTab") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
      console.log(dataUrl);
      chrome.storage.local.set({ screenshotBlob: dataUrl });
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "take-screenshot") {
    chrome.action.openPopup();
  }
});
