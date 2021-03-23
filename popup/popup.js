const oContent = document.getElementById('content');
const bgWindow = chrome.extension.getBackgroundPage();
const tabEle = document.getElementById('tab')
const devTabEle = document.getElementsByClassName('tab-dev')[0]
const testTabEle = document.getElementsByClassName('tab-test')[0]
const addBtnEle = document.getElementById('add')
const devListEle = document.getElementsByClassName('dev-list')[0]
const testListEle = document.getElementsByClassName('test-list')[0]
const phoneInputEle = document.getElementsByClassName('phone-input')[0]
const passwordInputEle = document.getElementsByClassName('password-input')[0]

let currentTab = 1,
  devAccountList = [],
  testAccountList = [],
  devAccounts,
  testAccounts;

// 初始化事件绑定
function initEvent() {
  /* tab切换 */
  tabEle.addEventListener('click', (data) => {
    let index = data.target.dataset.index
    if (index && currentTab != index) {
      if (currentTab == 1) {
        devListEle.classList.add('hidden')
        testListEle.classList.remove('hidden')
      }
      else {
        devListEle.classList.remove('hidden')
        testListEle.classList.add('hidden')
      }
      let addEle = currentTab == 1 ? testTabEle : devTabEle,
        removeEle = addEle == devTabEle ? testTabEle : devTabEle;
      removeEle.classList.contains('active') ? removeEle.classList.remove('active') : {}
      addEle.classList.contains('active') ? {} : addEle.classList.add('active')
      currentTab = index
    }
  })

  // oBt.addEventListener('click', () => {
  //   console.log('返回值11')
  //   // 
  //   function sendMessageToContentScript(message, callback) {
  //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //       chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
  //         if (callback) callback(response);
  //       });
  //     });
  //   }
  //   sendMessageToContentScript({ cmd: 'test', value: '你好，我是popup！' }, function (response) {
  //     console.log('来自content的回复：' + response);
  //   });

  //   // 操作 background的上下文
  //   bgWindow.showTime = false
  //   chrome.browserAction.setBadgeBackgroundColor({ color: 'blue' });
  //   chrome.browserAction.setBadgeText({ text: '占领' });
  //   //  // 异步请求
  //   //  ajaxGet('https://www.zhangzhaosong.com/', (res)=>{
  //   //   console.log('返回值', res)
  //   // })
  // })
  /* 添加账号  */
  addBtnEle.addEventListener('click', async () => {
    let phone = phoneInputEle.value || '',
      password = passwordInputEle.value || ''
    if (!phone || !password) {
      return
    }
    let data = { phone: phone.trim(), password: password.trim() }
    if (currentTab == 1) {
      devAccounts.addAccount(data)
      devAccounts.updateStorage()
    }
    else {
      testAccounts.addAccount(data)
      testAccounts.updateStorage()
    }
    phoneInputEle.value = ''
    passwordInputEle.value = ''
  })
}
// // 添加账号
// function addAccount(account) {
//   let itemEle = document.getElementsByTagName('template')[0].content.children[0].cloneNode(true)
//   itemEle.getElementsByClassName('phone')[0].innerText = account.phone
//   itemEle.getElementsByClassName('password')[0].innerText = account.password
//   listEle.appendChild(itemEle)
// }

/* 初始化数据 */
async function initData() {
  let devKey = getStorageKey(1),
    devList = await _storage.getStorage(devKey, []),
    testKey = getStorageKey(2),
    testList = await _storage.getStorage(testKey, []);
  devAccounts = new Account(devList.filter(item => item.phone), devListEle, devKey)
  testAccounts = new Account(testList.filter(item => item.phone), testListEle, testKey)
}
// 初始化
function init() {
  initData()
  initEvent()
}
init()


function ajaxGet(url, fn) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      fn(xhr.responseText);
    }
  }
}
function getStorageKey(currentTab) {
  return currentTab == 1 ? 'devAccountList' : 'testAccountList'
}


