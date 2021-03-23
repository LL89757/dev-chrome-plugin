function AccountModel(data) {
  let _this = this
  _this.phone = data.phone
  _this.password = data.password
}

function AccountView(model, el) {
  let _this = this
  _this.model = new AccountModel(model)
  _this.key = guid()
  _this.el = el
  let lastLoginUrl = '',
    reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/)
  async function init() {
    lastLoginUrl = await _storage.getStorage('lastLoginUrl', '')
    _this.el.getElementsByClassName('phone')[0].innerText = _this.model.phone
    _this.el.getElementsByClassName('password')[0].innerText = _this.model.password
    _this.el.getElementsByClassName('login')[0].addEventListener('click', _login)
    _this.el.getElementsByClassName('fastlogin')[0].addEventListener('click', _fastLogin)
    _this.el.getElementsByClassName('delete')[0].addEventListener('click', _delete)
  }
  const _delete = () => {
    _eventBus.emit('deleteItem', _this)
    _this.el.parentNode.removeChild(_this.el)
  }
  const _login = (e) => {
    _sendMessageToContentScript({ phone: _this.model.phone, password: _this.model.password, type: 'login' }, function (response) {
      let color = 'blue',
        text = "成功"
      if (!response) {
        text = '失败',
          color = 'red'
        _notice.show('登录失败', { body: '请确认当前账号是否正确或当前页面是否为校宝app登录首页' })
      }
      else {
        lastLoginUrl ? _storage.setStorage('lastLoginUrl', lastLoginUrl) : {}
        _notice.show('登录成功', { body: '' })
      }
      chrome.browserAction.setBadgeBackgroundColor({ color });
      chrome.browserAction.setBadgeText({ text });
      // console.log('来自content的回复：' + response);
    });
  }
  const _sendMessageToContentScript = (message, callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      lastLoginUrl = tabs[0].url ? (tabs[0].url.match(reg)[0] || '') : ''
      chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
        if (callback) callback(response);
      });
    });
  }
  const _fastLogin = () => {
    if (!lastLoginUrl) {
      _notice.show('操作失败', { body: '未获取到上次登录站点域名' })
      return
    }
    chrome.extension.sendMessage({ phone: _this.model.phone, password: _this.model.password, type: 'fastlogin' }, function (response) { console.log(response); });
    var w = window.open(lastLoginUrl);
    if (w) {
      w.blur();
      window.focus();
    }
  }
  init()
}

function AccountList(data) {
  let _this = this
  _this.data = data || []
  this.deleteAccount = (model) => {
    let index = _this.data.findIndex((item) => item.key == model.key)
    index != -1 ? _this.data.splice(index, 1) : void 0
  }
  this.addAccount = (model) => {
    _this.data.push(model)
  }
  this.getModelList = () => {
    return _this.data.filter((item) => { return item.model }).map(item => item.model)
  }
}

function Account(data, el, storageKey) {
  let _this = this
  _this.el = el
  _this.storageKey = storageKey
  _this.accountList = new AccountList(data)
  let hasInit = false
  // 添加账号
  _this.addAccount = (account) => {
    let itemEle = document.getElementsByTagName('template')[0].content.children[0].cloneNode(true)
    _this.el.appendChild(itemEle)
    _this.accountList.addAccount(new AccountView(account, itemEle))
  }
  _this.getModelList = () => {
    return _this.accountList.getModelList()
  }
  function init() {
    _this.accountList.data.forEach(item => {
      _this.addAccount(item)
    });
    _eventBus.on('deleteItem', (item) => {
      _this.accountList.deleteAccount(item)
      _this.updateStorage()
    })
    hasInit = true
  }
  this.updateStorage = () => {
    _storage.setStorage(this.storageKey, _this.getModelList())
  }
  init()
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
