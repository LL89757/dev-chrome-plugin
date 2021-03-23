const prefix = 'xbapp_'
function Storage() {
  this.getStorage = (key, defaultValue) => {
    return new Promise((res, rej) => {
      key = `${prefix}${key}`
      let data = {}
      data[key] = defaultValue
      // 读取的key与这个key的默认值
      chrome.storage.sync.get(data, function (storage) {
        console.log(storage)
        res(storage[key])
      });
    })
  }

  this.setStorage = (key, value) => {
    let data = {}
    key = `${prefix}${key}`
    data[key] = value
    return new Promise((res, rej) => {
      chrome.storage.sync.set(data, function () {
        res(true)
      });
    })
  }
}

window._storage = new Storage()
