import Log from "../common/Log";

//撤回的点的数组
var withdrawArr = [];

cc.Class({
    extends: cc.Component,

    properties: {

    },

    //传入画布
    init(draw) {
        this.drawMgr = draw;
        this._drawUint8Array = draw.drawUint8Array;
        this._drawSprite = draw.drawSprite;
        this._width = this.node.width;
        this._height = this.node.height;
        
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onDestroy(){
        this.node.off(cc.Node.EventType.TOUCH_START, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this);
    },


    onTouchStart(evt) {
        if(!this._drawUtils){return Log.d('当前无画笔')}        
        let loc = evt.getLocation();
        let drawLoc = this._transition(loc);
        this._drawUint8Array.moveTo(drawLoc.x , drawLoc.y);

        withdrawArr = [];
        withdrawArr = this._drawUint8Array.copyData();
        if(!this._drawUtils.haveColor){
            this._clearWithLocation_line(drawLoc)
        }else{
            this.drawColor(drawLoc);
        }
    },

    onTouchMove(evt) {
        if(!this._drawUtils){return}
        let touchLoc = evt.getLocation();
        let drawLoc = this._transition(touchLoc);
        if(!this._drawUtils.haveColor){
            this._clearWithLocation_line(drawLoc)
        }else{
            this.drawColor(drawLoc);
        }
    },

    onTouchEnd(evt) {},
    onTouchCancel(evt) {},

    _transition(loc) {
        let touchLoc = this.node.convertToNodeSpaceAR(loc);
        touchLoc.x += this._width / 2;
        touchLoc.y += this._height / 2;
        return touchLoc;
    },

    drawColor(drawLoc){
        let random = this._drawUtils.width;
        let offSet = parseInt(random / 2);
        for(let i = 0; i < 20; i++){
            let up = [drawLoc.x - offSet + Math.random()*random, drawLoc.y + Math.random()*random];
            let left = [drawLoc.x - Math.random()*random, drawLoc.y - offSet + Math.random()*random];
            let right= [drawLoc.x + Math.random()*random, drawLoc.y - offSet + Math.random()*random];
            let bottom= [drawLoc.x - offSet + Math.random()*random, drawLoc.y - Math.random()*random];
            this._drawUint8Array.circle(up[0], up[1], 2);
            this._drawUint8Array.circle(left[0], left[1], 2);
            this._drawUint8Array.circle(right[0], right[1], 2);
            this._drawUint8Array.circle(bottom[0], bottom[1], 2);
        }
        this._drawRightAway();
    },

    _drawRightAway() {
        if(!this._drawSprite){return Log.err('drawCtrl.js--94行,this._drawSprite不存在')}
        let data = this._drawUint8Array.getData();
        let texture = this._drawSprite.spriteFrame.getTexture();
        let opts = texture._getOpts();
        opts.image = data;
        opts.images = [opts.image];
        texture.update(opts);
    },

    _clearWithLocation_circle(drawLoc){
        let radius = Math.round(this._drawUtils.width / 2);
        this._drawUint8Array.circle(drawLoc.x, drawLoc.y, radius);
        this._drawRightAway();
    },

    _clearWithLocation_line(drawLoc){
        this._drawUint8Array.lineTo(drawLoc.x, drawLoc.y);
        this._drawRightAway();
    },

    //撤回 只能撤回一次
    withdraw(){
        if(withdrawArr.length){
            this._drawUint8Array.setData(withdrawArr);
            withdrawArr = [];
            this._drawRightAway();
        }
    },

    //画笔
    set_drawUtilsInfo(drawUtils, lastColorPen){
        this._drawUtils = drawUtils;
        this._lastColorPen = lastColorPen;
    }

})

