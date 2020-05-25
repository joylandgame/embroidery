import Log from '../common/Log'
cc.Class({
    extends: cc.Component,
    properties: {
        rectNode:   cc.Node,

        touchToMoveLayer: cc.Node,
        scaleBtn: cc.Node,

        touchRectSpr: cc.SpriteFrame,
        touchScaleSpr: cc.SpriteFrame,
    },

    onLoad(){
        this.touchToMoveLayer.on('touchstart', this.touchstart_tomovelayer, this);
        this.touchToMoveLayer.on('touchmove', this.touchmove_tomovelayer, this);
        this.touchToMoveLayer.on('touchend', this.touchend_tomovelayer, this);
        this.touchToMoveLayer.on('touchcancel', this.touchcancel_tomovelayer, this);                                                                                                                                                                                                                   
        
        this.baseDis = Math.sqrt(150*150 + 150*150);
    },

    init(){

    },

    touchstart_tomovelayer(evt){
        cc.vv.eventMgr.emit(cc.vv.eventName.close_moveScale_guide);
        let rect_1 = this.node.getBoundingBox();
        // if(this.scale){
        //     rect_1.width  *= this.scale;
        //     rect_1.height *= this.scale;
        // }
        let p   = evt.getLocation();
        let p_1 = this.touchToMoveLayer.convertToNodeSpaceAR(p);
        this.toMoveStart = null;
        this.angleLayer_touchPos = null;

        let rect_2 = this.scaleBtn.getBoundingBox();
        let pp  = this.scaleBtn.convertToWorldSpaceAR(cc.v2(0,0));
        let pp_1 = this.touchToMoveLayer.convertToNodeSpaceAR(pp);
        rect_2.x = pp_1.x;
        rect_2.y = pp_1.y;
        let offSetP = cc.v2(p_1.x + 23, p_1.y + 63)
        if(rect_2.contains(offSetP)){
            this.targetPos = this.node.getPosition();
        }else if(rect_1.contains(p_1)){
            this.rectNode.getComponent(cc.Sprite).spriteFrame = this.touchRectSpr;
            this.scaleBtn.getComponent(cc.Sprite).spriteFrame = this.touchScaleSpr;
            this.toMoveStart = p;
        }else{
            this.angleLayer_touchPos = p;
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

        if(this.targetPos){
            let p_1 = this.touchToMoveLayer.convertToNodeSpaceAR(p);
            this.lastDis   = Math.sqrt((p_1.x - this.targetPos.x)*(p_1.x - this.targetPos.x)+(p_1.y - this.targetPos.y)*(p_1.y - this.targetPos.y));
            let ratio = this.lastDis / this.baseDis;
            this.node.scale = this.scale = ratio < 0.2 ? 0.2 : ratio > 1 ? 1 : ratio;
        }
    },

    touchend_tomovelayer(){
        if(this.angleLayer_touchPos && !this.angleLayer_move){
            this.rectNode.getComponent(cc.Sprite).spriteFrame          = null;
            this.scaleBtn.getComponent(cc.Sprite).spriteFrame = null;
        }
        this.scaleLayer_touchPos = null;
        this.angleLayer_touchPos = null;
        this.targetPos = null;
        this.angleLayer_move = false;
        this.scaleLayer_move = false;
        Log.d('put scale and pos and angle : ', this.node.scale, this.node.x, this.node.y, this.node.angle)
    },

    touchcancel_tomovelayer(){   
        this.scaleLayer_touchPos = null;
        this.angleLayer_touchPos = null;
        this.targetPos = null;
        this.angleLayer_move = false;
        this.scaleLayer_move = false;
    },

    getMinBase(a,b){
        let _a = a;
        let _b = b;
        a=Math.abs(a);
        b=Math.abs(b);
 
        return a > b ? _b : _a;
    },

})