const redColor = cc.color(212,0,210,255)
const grayColor = cc.color(182,165,165,255);

cc.Class({
    extends:cc.Component,
    properties:{
        cutNodelist:[cc.Node],
        material:cc.Material,
        lineNodeList:[cc.Node],
    },

    onLoad() {
        /*
        this.node.on(cc.Node.EventType.TOUCH_START,this.clipCut,this)
        */
        this.count = 0;
        this.flag = false;

        this.setBlurColor(redColor,true);
    },

    setBlurColor(color,init) {
        for (let i=0;i<this.cutNodelist.length;i++) {
            let node = this.cutNodelist[i]
            node.on(cc.Node.EventType.TOUCH_START,this.clipCut,this);
            let sprite = node.getComponent(cc.Sprite);
            if(init) {
                sprite.setMaterial(0,this.material);
            } 
            sprite.getMaterial(0).setProperty("color",color);
        }
    },

    clipCut(e) {
        let touchnode = e.target
        if (!touchnode.active) {
            return;
        } 
 
        let texture = touchnode.getComponent(cc.Sprite).spriteFrame.getTexture()
        let ro  = Math.random()<0.6?-Math.random()*40:Math.random()*40;
        let ani = new cc.sequence(cc.delayTime(0.1),cc.spawn(
            cc.rotateBy(1, ro),
            cc.moveBy(2,0,-1000),
            ///cc.delayTime(2.0),

        ),cc.delayTime(2),cc.callFunc(()=>{
            this.checkEmpty();
            console.log("flow check");
        })) 
        
        touchnode.runAction(ani);
        let findindex = -1;
        for(let i=0;i<this.cutNodelist.length;i++) {
            if (this.cutNodelist[i] == touchnode) {
               findindex = i;
               this.cutNodelist.splice(i,1); 
               break;
            }
        }   
        if(findindex >= 0) {
            this.lineNodeList[findindex].parent = null;
            this.lineNodeList.splice(findindex,1);
        }      
     },
     checkEmpty() {
        if (this.cutNodelist.length ==0) {
            cc.vv.eventMgr.emit(cc.vv.eventName.clear_tailor_list);
        }
     },
     update(dt) {
        this.count += dt;
        if(this.count >1.0) {
            this.count = 0;
            if(this.flag) {
                this.flag = false;
                this.setBlurColor(redColor,false);
            } else {
                this.flag = true;
                this.setBlurColor(grayColor,false);
            }
        }
     }
})