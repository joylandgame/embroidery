// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        effectIcon:[cc.SpriteFrame],
        musicIcon:[cc.SpriteFrame],

        musicBtn: cc.Sprite,
        effectBtn: cc.Sprite,

        layer: cc.Node,
        bg: cc.Node,
    },

    init(){
        this.isOpen = false;
        this.isCanCallBack = false;
        this.bg.angle = 0;
        this.layer.setScale(cc.v2(1,0));
        this.initIcon();
    },

    initIcon(){
        let bgm = cc.vv.userInfo.openBgm;
        let effect = cc.vv.userInfo.openEffect;
        this.musicBtn.spriteFrame = bgm == 'true' ? this.musicIcon[0] : this.musicIcon[1];
        this.effectBtn.spriteFrame = effect == 'true' ? this.effectIcon[0] : this.effectIcon[1];
    },

    touch(){
        if(this.isOpen){
            this.isOpen = false;
            this.isCanCallBack = false;

            this.bg.stopAllActions();
            this.bg.runAction(cc.rotateBy(0.1,60))
            this.layer.stopAllActions();
            this.layer.runAction(cc.scaleTo(0.1,1,0))
        }else{
            this.isOpen = true;
            this.bg.stopAllActions();
            this.bg.runAction(cc.rotateBy(0.1,-60))
            this.layer.stopAllActions();
            this.layer.runAction(cc.sequence(cc.scaleTo(0.1,1,1),cc.callFunc(()=>{
                this.isCanCallBack = true;
            },this)));
        }
        this.initIcon();
    },

    callBack(evt){
        if(!this.isCanCallBack){
            return;
        }
        switch(evt.target.name){
            case 'effect':
                let effect = cc.vv.userInfo.openEffect;
                effect = effect == 'true' ? 'false' : 'true';
                cc.vv.userMgr.setOpenEffect(effect);
                break;

            case 'music':
                let bgm = cc.vv.userInfo.openBgm;
                bgm = bgm == 'true' ? 'false' : 'true';
                cc.vv.userMgr.setOpenBgm(bgm);
                break;
        }
        this.initIcon();
        this.updateState();
    },

    updateState(){
        let bgm = cc.vv.userInfo.openBgm;
        if(bgm == 'true'){
            cc.vv.audioMgr.playBgm();
        }else{
            cc.vv.audioMgr.stopBgm();
        }
    },
});
