// 构造EventBus
function EventBus() {
    this.msgQueues = {}
}

EventBus.prototype = {
    // 将消息保存到当前的消息队列中
    on: function (msgName, func) {
        if (this.msgQueues.hasOwnProperty(msgName)) {
            if (typeof this.msgQueues[msgName] === 'function') {
                this.msgQueues[msgName] = [this.msgQueues[msgName], func]
            } else {
                this.msgQueues[msgName] = [...this.msgQueues[msgName], func]
            }
        } else {
            this.msgQueues[msgName] = func;
        }
    },
    // 消息队列中仅保存一个消息
    one: function (msgName, func) {
        // 无需检查msgName是否存在
        this.msgQueues[msgName] = func;
    },
    // 发送消息
    emit: function (msgName, msg) {
        if (!this.msgQueues.hasOwnProperty(msgName)) {
            return
        }
        if (typeof this.msgQueues[msgName] === 'function') {
            this.msgQueues[msgName](msg)
        } else {
            this.msgQueues[msgName].map((fn) => {
                fn(msg)
            })
        }
    },
    // 移除消息
    off: function (msgName) {
        if (!this.msgQueues.hasOwnProperty(msgName)) {
            return
        }
        delete this.msgQueues[msgName]
    }
}

const eventBus = new EventBus()
window._eventBus = eventBus