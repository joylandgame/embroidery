cc.Class({
    extends: cc.Component,
    properties: {
        rectNode:   cc.Node,

        touchToMoveLayer: cc.Node,
        touchToScaleLayer: cc.Node,

        touchRectSpr: cc.SpriteFrame,
        touchScaleSpr: cc.SpriteFrame,
    },

    onLoad(){

        this.touchToMoveLayer.on('touchstart', this.touchstart_tomovelayer, this);
        this.touchToMoveLayer.on('touchmove', this.touchmove_tomovelayer, this);
        this.touchToMoveLayer.on('touchend', this.touchend_tomovelayer, this);
        this.touchToMoveLayer.on('touchcancel', this.touchcancel_tomovelayer, this);

        this.touchToScaleLayer.on('touchstart', this.touchstart_scalelayer, this);
        this.touchToScaleLayer.on('touchmove', this.touchmove_scalelayer, this);
        this.touchToScaleLayer.on('touchend', this.touchend_scalelayer, this);
        this.touchToScaleLayer.on('touchcancel', this.touchcancel_scalelayer, this);

        this.scaleBtnDefault_x = this.touchToScaleLayer.x;
        this.scaleBtnDefault_y = this.touchToScaleLayer.y;                                                                                                                                     
    },

    init(){

    },

    touchstart_tomovelayer(evt){
        let rect = this.node.getBoundingBox();
        let p = evt.getLocation();
        let p_1 = this.touchToMoveLayer.convertToNodeSpaceAR(p);
        this.toMoveStart = null;
        this.angleLayer_touchPos = null;
        if(rect.contains(p_1)){
            this.rectNode.getComponent(cc.Sprite).spriteFrame          = this.touchRectSpr;
            this.touchToScaleLayer.getComponent(cc.Sprite).spriteFrame = this.touchScaleSpr;
            this.toMoveStart = p;
        }else{
            this.angleLayer_touchPos = evt.getLocation();
        }
    },

    touchmove_tomovelayer(evt){
        let p = evt.getLocation();
        if(this.toMoveStart){
            let offSetX = p.x - this.toMoveStart.x;
            let offsetY = p.y - this.toMoveStart.y;
            this.node.x += offSetX;
            this.node.y += offsetY;
            this.toMoveStart = p;
        }

        if(this.angleLayer_touchPos){
            this.angleLayer_move = true;
            let offset = Math.floor(p.x - this.angleLayer_touchPos.x);

            this.node.angle += offset / 10;
            this.angleLayer_touchPos = p;
        }
    },

    touchend_tomovelayer(){
        if(this.angleLayer_touchPos && !this.angleLayer_move){
            this.rectNode.getComponent(cc.Sprite).spriteFrame          = null;
            this.touchToScaleLayer.getComponent(cc.Sprite).spriteFrame = null;
        }
        this.angleLayer_move = false;
    },

    touchcancel_tomovelayer(){},

    touchstart_scalelayer(evt){
        // this.touchToScaleLayer.setScale(cc.v2(1.1,1.1));
    },

    touchmove_scalelayer(evt){
        let p   = evt.getLocation();
        let p_1 = this.touchToMoveLayer.convertToNodeSpaceAR(p);

        if(p_1.x < this.scaleBtnDefault_x && p_1.y > this.scaleBtnDefault_y
        || p_1.x > this.scaleBtnDefault_x && p_1.y < this.scaleBtnDefault_y){
            let move_x = parseInt(p_1.x - this.scaleBtnDefault_x);
            let move_y = parseInt(this.scaleBtnDefault_y - p_1.y);
            let min    = this.getMinBase(move_x, move_y) / 2;
            let ratio  = min / this.scaleBtnDefault_x + 1;
            ratio = ratio > 1.5 ? 1.5 : ratio;
            ratio = ratio < 0.5 ? 0.5 : ratio;
            this.node.setScale(cc.v2(ratio, ratio));
        }
    },

    touchend_scalelayer(evt){
        // this.touchToScaleLayer.setScale(cc.v2(1,1));
    },

    touchcancel_scalelayer(evt){
        // this.touchToScaleLayer.setScale(cc.v2(1,1));
    },

    getMinBase(a,b){
        let _a = a;
        let _b = b;
        a=Math.abs(a);
        b=Math.abs(b);
 
        return a > b ? _b : _a;
    },

})