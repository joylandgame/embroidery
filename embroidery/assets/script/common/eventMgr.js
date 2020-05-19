const eventMgr = {
    events: null,
    //注册事件
    on: function (eventName, callfunc, self) {
        if (!this.events) {this.events = {}}

        if (!this.events[eventName]) {
            let obj = {}
            obj.funcs = []
            obj.funcs.push(callfunc)
            obj.selfs = []
            obj.selfs.push(self)
            this.events[eventName] = obj
        } else {
            let obj = this.events[eventName]
            obj.funcs.push(callfunc)
            obj.selfs.push(self)
        }
    },
    //派发事件
    emit: function (eventName, data) {
        if (!this.events || !this.events[eventName]) return
        for (let k in this.events) {
            if (k == eventName) {
                let obj = this.events[k]
                for (let i in obj.funcs) {
                    let func = obj.funcs[i]
                    let self = obj.selfs[i]
                    func.call(self, data)
                }
            }
        }
    },
    //关闭单个监听
    off: function (eventName, callfunc, self) {
        if (!this.events || !this.events[eventName]) return
        for (let k in this.events) {
            if (k == eventName) {
                let obj = this.events[k]
                for (let i in obj.funcs) {
                    if (obj.funcs[i] == callfunc && obj.selfs[i] === self) {
                        let index = parseInt(i)
                        obj.funcs.splice(index, 1)
                        obj.selfs.splice(index, 1)
                        if (obj.funcs.length == 0) {
                            this.events[eventName] = null
                        }
                    }
                }
            }
        }

    },

    //移除所有与eventName 相关联的事件
    removeAllListenerByName: function (eventName) {
        if (this.events && this.events[eventName]) {
            this.events[eventName] = null
        }

    },
    //移除所有监听  (不要轻易调这个函数)
    removeAllListener: function () {
        if (this.events) {
            this.events = null
        }
    }
}
export default eventMgr;