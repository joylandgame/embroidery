import Log from '../common/Log';
import utils from '../common/utils';
// cc.vv.gameDemo       // texture
// cc.vv.gameDemoWhite  // texture
// cc.vv.gameClipArr    // [ texture ]
cc.Class({
    extends: cc.Component,

    properties: {
        rawMaterial : cc.Node,

        demoTip    : cc.Node,
        demoTip_spr: cc.Sprite,

        clipBtn:cc.Node,
    },

    init(data){
        this.game    = data.game;
        this.gameID  = data.id;
        this.isOver  = data.complete;
        this.initView();
        this.addEvent();
    },

    addEvent(){
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    onDestroy(){
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    game_go_home(){
        
    },

    clear(){
        this.clipsArr = null; //掉落的部分
        this.linesArr = null; //线部分
        this.clipBaseNode = null; //正确的衣服
        this.demoTip_spr.spriteFrame = null; //提示板上的衣服
        this.rawMaterial.removeAllChildren();//清空案板上所有东西
    },

    initView(){
        this.showDemo();
        if(!this.isOver){this.showClips();}
        this.setUtilsView();
    },

    setUtilsView(){
        this.clipBtn.active = !this.isOver;
    },

    //展示需要裁减的部分
    showClips(){
        if(!this.clipsArr){ //放入裁剪的数组
            if(!cc.vv.gameClipArr.length){
                Log.catch('in tailorTabMgr 61',cc.vv.gameClipArr);
                return;
            }
            this.clipsArr = [];
            this.linesArr = [];
            cc.vv.gameClipArr.forEach(element => {
                let frame  = new cc.SpriteFrame(element);
                let node   = new cc.Node();
                let sprite = node.addComponent(cc.Sprite);
                sprite.sizeMode = 2;
                sprite.trim = false;
                sprite.spriteFrame = frame;
                node.parent = this.rawMaterial;
                if(element.name.split('_')[0] == 'line'){
                    node.zIndex = 2;
                    this.linesArr.push(node);
                }else{
                    node.zIndex = 1;
                    this.clipsArr.push(node);
                }
            });
        }
    },

    //展示正确的衣服 正确衣服和裁减部分拼接
    showDemo(){
        if(!this.clipBaseNode){ //基础的衣服 white模板
            if(!cc.vv.gameDemoWhite){
                Log.catch('in tailorTabMgr 40',cc.vv.gameDemoWhite);
                return;
            }
            let frame  = new cc.SpriteFrame(cc.vv.gameDemoWhite);
            let node   = this.clipBaseNode = new cc.Node();
            let sprite = node.addComponent(cc.Sprite);
            sprite.sizeMode = 2;
            sprite.trim = false;
            sprite.spriteFrame = frame;
            node.parent = this.rawMaterial;
        }
        if(!this.demoTip_spr.spriteFrame){
            if(!cc.vv.gameDemo){
                Log.catch('in tailorTabMgr 40',cc.vv.gameDemo);
                return;
            }
            this.scheduleOnce(()=>{
                let v2     = this.demoTip.getPosition();
                let offset = cc.winSize.height / 2;
                this.demoTip.runAction(
                    cc.moveTo(0.5,v2.x,offset).easing(cc.easeBackOut(10000000))
                )
            },0)
            this.demoTip_spr.spriteFrame = new cc.SpriteFrame(cc.vv.gameDemo);
        }
    },

    cutCallBack(){
        if(this.isOver){return}
        if(this.linesArr && this.linesArr.length){
            this.linesArr.forEach(element=>{
                element.active = false;
            })
        }
        if(this.clipsArr && this.clipsArr.length){
            this.clipsArr.forEach(element=>{
                let ro  = Math.random()<0.6?-Math.random()*40:Math.random()*40;
                let ani = new cc.spawn(
                    cc.rotateBy(1, ro),
                    cc.moveBy(2,0,-1000),
                )
                element.runAction(ani);
            })
        }
        this.result();
    },

    result(){
        this.isOver = true;
        cc.vv.eventMgr.emit(cc.vv.eventName.complete_one_game,this.gameID);
        this.setUtilsView();
    },

    hide(){
        this.node.active = false;
    }
})