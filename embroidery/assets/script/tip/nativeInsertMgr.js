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
        
        let model = callback.GetModel()
        let imgurl = model.imgUrlList
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
    },

    start() {

    },

    onContinue() {
        ///this.node.active = fale;
        this.callback.CloseHandle();
        this.node.active = false;
    },
    onVideo() {
        this.callback.ClickHandle();
        this.node.active = false;
    },
    // update (dt) {},
});