import Log from '../common/Log';
import utils from '../common/utils';
// cc.vv.clothesDemo       // texture
// cc.vv.clothesDemoWhite  // texture
// cc.vv.clothesClipArr    // [ texture ]
cc.Class({
    extends: cc.Component,

    properties: {
        rawMaterial : cc.Node,

        demoTip    : cc.Node,
        demoTip_spr: cc.Sprite,

        clipBtn: dragonBones.ArmatureDisplay,

        headGuide: cc.Node,
        goNextBtn: cc.Node,
    },

    init(data){
        this.game    = data.game;
        this.gameID  = data.id;
        this.isOver  = data.complete;
        this.goNextBtn.active = this.isOver;
        this.clipBtn.node.active   = false;
        this.clipName = cc.vv.skinMgr.getUserUseScissor().skin_res_name + "_clip";
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
        this.clipsArr_1 = null; //掉落的部分
        this.linesArr_1 = null; //线部分
        this.clipBaseNode = null; //正确的衣服
        this.demoTip_spr.spriteFrame = null; //提示板上的衣服
        this.rawMaterial.removeAllChildren();//清空案板上所有东西
    },

    initView(){
        this.showDemo();
        if(!this.isOver){this.showClips();}
    },

    //展示需要裁减的部分
    showClips(){
        if(!this.linesArr_1 && !this.linesArr_2){ //放入裁剪的数组
            if(!cc.vv.clothesClipArr.length){
                Log.catch('in tailorTabMgr 61',cc.vv.clothesClipArr);
                return;
            }
            this.clipsArr_1 = [];
            this.clipsArr_2 = [];
            this.linesArr_1 = [];
            this.linesArr_2 = [];
            cc.vv.clothesClipArr.forEach(element => {
                let frame  = new cc.SpriteFrame(element);
                let node   = new cc.Node();
                let sprite = node.addComponent(cc.Sprite);
                sprite.sizeMode = 2;
                sprite.trim = false;
                sprite.spriteFrame = frame;
                node.parent = this.rawMaterial;
                if(element.name.split('_')[1] == 'line'){
                    node.zIndex = 1;
                    if(element.name.split('_')[3]){
                        if(element.name.split('_')[3] == '0'){
                            this.linesArr_1.push(node);
                        }
                        if(element.name.split('_')[3] == '1'){
                            this.linesArr_2.push(node);
                        }
                    }else{
                        this.linesArr_1.push(node);
                    }
                }else{
                    node.zIndex = 0;
                    if(element.name.split('_')[3]){
                        if(element.name.split('_')[3] == '0'){
                            this.clipsArr_1.push(node);
                        }
                        if(element.name.split('_')[3] == '1'){
                            this.clipsArr_2.push(node);
                        }
                    }else{
                        this.clipsArr_1.push(node);
                    }
                }
            });
            // this.scheduleOnce(()=>{
                this.showGuide(1);
            // }, 0.1)
            
        }
    },

    //展示正确的衣服 正确衣服和裁减部分拼接
    showDemo(){
        if(!this.clipBaseNode){ //基础的衣服 white模板
            if(!cc.vv.clothesDemoWhite){
                Log.catch('in tailorTabMgr 40',cc.vv.clothesDemoWhite);
                return;
            }
            let frame  = new cc.SpriteFrame(cc.vv.clothesDemoWhite);
            let node   = this.clipBaseNode = new cc.Node();
            let sprite = node.addComponent(cc.Sprite);
            sprite.sizeMode = 2;
            sprite.trim = false;
            sprite.spriteFrame = frame;
            node.parent = this.rawMaterial;
        }
        if(!this.demoTip_spr.spriteFrame){
            if(!cc.vv.clothesDemo){
                Log.catch('in tailorTabMgr 40',cc.vv.clothesDemo);
                return;
            }
            this.scheduleOnce(()=>{
                this.demoTip.y = cc.winSize.height / 2;
                let offset     = this.demoTip.y - this.demoTip.height + 60
                this.demoTip.runAction(
                    cc.moveTo(0.5,this.demoTip.x,offset).easing(cc.easeBackOut())
                )
            },0.018)
            this.demoTip_spr.spriteFrame = new cc.SpriteFrame(cc.vv.clothesDemo);
        }
    },

    cutCallBack(){
        if(this.isOver || this.isCut){return}
        this.hideGuide();
        if(this.linesArr_1 && this.linesArr_1.length){
            this.linesArr_1.forEach(element=>{
                element.active = false;
            })
            this.linesArr_1 = [];
        }else if(this.linesArr_2 && this.linesArr_2.length){
            this.linesArr_2.forEach(element=>{
                element.active = false;
            })
            this.linesArr_2 = [];
        }
        if(this.clipsArr_1 && this.clipsArr_1.length){
            this.clipsArr_1.forEach(element=>{
                let ro  = Math.random()<0.6?-Math.random()*40:Math.random()*40;
                let ani = new cc.spawn(
                    cc.rotateBy(1, ro),
                    cc.moveBy(2,0,-1000),
                )
                element.runAction(ani);
            })
            this.clipsArr_1 = [];
        }else if(this.clipsArr_2 && this.clipsArr_2.length){
            this.clipsArr_2.forEach(element=>{
                let ro  = Math.random()<0.6?-Math.random()*40:Math.random()*40;
                let ani = new cc.spawn(
                    cc.rotateBy(1, ro),
                    cc.moveBy(2,0,-1000),
                )
                element.runAction(ani);
            })
            this.clipsArr_2 = [];
        }

        this.clipBtnAni();

        if(this.clipsArr_1.length == 0 && this.clipsArr_2.length == 0){
            this.isOver = true;
            this.goNextBtn.active = true;
            this.showGuide(2);
            this.scheduleOnce(()=>{
                this.result();
            }, 5)
        }
    },

    clipBtnAni(){
        this.isCut = true;
        this.clipBtn.node.active = true;
        this.clipBtn.playAnimation(this.clipName);
        this.clipBtn.node.runAction(cc.sequence(cc.moveTo(0.5, -this.clipBtn.node.x, this.clipBtn.node.y), cc.callFunc(()=>{
            this.isCut = false;
            this.clipBtn.node.active = false;
            this.clipBtn.node.angle  = -this.clipBtn.node.angle;
            this.showGuide(1);
        },this)))
    },

    result(){
        cc.vv.userMgr.setUserGudie('0');
        cc.vv.eventMgr.emit(cc.vv.eventName.complete_one_game,this.gameID);
    },


    showGuide(index){
        if(cc.vv.userInfo.guide && cc.vv.userInfo.guide['0']){
            return;
        }
        if(index == 1){
            if(this.clipsArr_1.length || this.clipsArr_2.length){
                this.headGuide.active = true;
                this.headGuide.setPosition(cc.v2(0,0));
            }
        }

        if(index == 2){
            let p = this.goNextBtn.getPosition();
            this.headGuide.setPosition(p);
            this.headGuide.active = true;
        }
    },

    hideGuide(){
        this.headGuide.active = false;
    }
})