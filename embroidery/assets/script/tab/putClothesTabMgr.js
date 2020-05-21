// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Log from '../common/Log';

cc.Class({
    extends: cc.Component,

    properties: {
        demo: cc.Sprite,
        draw: cc.Sprite,
        embroidery: cc.Sprite,

        submitBtn: cc.Node,
    },

    init(data){
        this.game    = data.game;
        this.gameID  = data.id;
        this.isOver  = data.complete;

        let completeInfo = cc.vv.gameMgr.confirmGameCompletion();
        this.submitBtn.active = completeInfo.finalStep;
        if(this.loadReady){
            this.node.active = true;
            return;
        }
        this.drawScore = 0;
        this.embroideryScore = 0;
        this.draw.spriteFrame = null;

        this.initDemo();
        this.initView();
        this.addEvent();
        this.loadReady = true;
    },

    addEvent(){
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    clear(){
        this.drawScore = 0;
        this.embroideryScore = 0;
        this.draw.spriteFrame = null;
        this.loadReady = false;
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    initDemo(){
        if(!cc.vv.clothesDemoWhite){
            Log.catch('err in putClothesTabMgr 36', cc.vv.clothesDemoWhite);
            return;
        }
        let texture = cc.vv.clothesDemoWhite;
        this.demo.spriteFrame = new cc.SpriteFrame(texture);
    },

    initView(){
        let drawData       = cc.vv.gameMgr.getPerformDrawData();
        let embroideryData = cc.vv.gameMgr.getPerformEmbroideryData();
        if(drawData){
            if(drawData.frame){
                this.draw.spriteFrame = drawData.frame;
            }
            this.drawScore = drawData.score;
        }
        if(embroideryData){
            if(embroideryData.frame){
                this.embroidery.spriteFrame= embroideryData.frame;
            }
            this.embroideryScore = embroideryData.score;
        }
    },

    resultCallBack(){




        
    },




    onDestroy(){
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

});
