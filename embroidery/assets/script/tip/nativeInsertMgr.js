cc.Class({
    extends: cc.Component,

    properties: {
        imgurl: cc.Sprite,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(callback) {
        console.log("原生nativeInsertMgr init")
        this.node.active = true;
        this.callback = callback;
        
        let imgurl;
        if(!!!callback) {
            ///////imgurl = "https://kuaizhiyou.com.cn/fenfa/icon/hdybicon.png"
        } else {
            let model = callback.GetModel()
            imgurl = model.imgUrlList
            if(imgurl && typeof(imgurl) !="string") {
                imgurl = imgurl[0]
            }

            cc.loader.load(imgurl, (err, texture) => {
                if(err != null) {
                    console.log("原生err======================",err.message);
                }
                var frame = new cc.SpriteFrame(texture);
                this.imgurl.spriteFrame = frame;
            
            });
        }
        return new Promise((resoved,reject)=>{
            let success,failure;
            success = ()=>{
                console.log("success")
                this.node.off("success",success,this)
                this.node.off("failure",failure,this);
                resoved(true)
            }
            failure = ()=>{
                console.log("failure")
                this.node.off("success",success,this)
                this.node.off("failure",failure,this);
                resoved(false)
            }
            this.node.on("success",success,this);
            this.node.on("failure",failure,this);
        })
    },

    start() {

    },

    onContinue() {
        ///this.node.active = fale;
        if(this.callback) {
            this.callback.CloseHandle();
        }
        console.log("onContinue")
        this.node.emit("failure");
        this.node.active = false;
    },
    onVideo() {
        console.log("onVideo");
        if(this.callback) {
            this.callback.ClickHandle().then((res)=>{
                if(res) {
                    this.node.emit("success");
                } else {
                    this.node.emit("failure"); 
                }
                this.node.active = false;
            });
        } else {
           this.node.emit("failure");
           this.node.active = false; 
        }
        
    },
    // update (dt) {},
});