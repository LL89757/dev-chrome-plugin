chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    setTimeout(() => {
      sendResponse("快捷登录");
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
        });
      });
    }, 1000);
  }
);