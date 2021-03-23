

function Notice() {

  this.popNotice = function (title, params) {
    if (Notification.permission == "granted") {
      var notification = new Notification(title, params);
      notification.onclick = function () {
        notification.close();
      };
      setTimeout(() => {
        notification.close();
      }, 3000);
    }
  };
}
Notice.prototype.show = function (title, params) {
  if (!window.Notification) {
    console.log('当前浏览器不支持通知')
  }
  if (Notification.permission == "granted") {
    this.popNotice(title, params);
  } else if (Notification.permission != "denied") {
    Notification.requestPermission((permission) => {
      this.popNotice(title, params);
    });
  }
}

window._notice = new Notice()
