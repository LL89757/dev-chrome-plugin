
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  callback(request, sender, sendResponse)
  return true
});
// 自定义登录逻辑
async function callback(request, sender, sendResponse) {
  let loginEle = document.getElementById('login'),
    phoneEle = document.getElementsByName('tel1')[0],
    pwdEle = document.getElementsByName('password')[0]
  if (loginEle && phoneEle && pwdEle) {
    phoneEle.value = request.phone
    pwdEle.value = request.password
    loginEle.click()
    setTimeout(() => {
      if (document.getElementById('login')) {
        sendResponse(false);
      }
      else {
        sendResponse(true);
      }
    }, 3000);
  }
  else {
    sendResponse(false);
  }

}
