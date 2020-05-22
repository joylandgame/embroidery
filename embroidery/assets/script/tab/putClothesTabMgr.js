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

        resultLayer: cc.Node,
        resultDemo : cc.Sprite,
        resultDemoWhite : cc.Sprite,
        resultDraw : cc.Sprite,
        resultIcon : cc.Sprite,
        resultAniNode: cc.Node,
        resultScoreNode: cc.Node,
        resultScore: cc.Label,
        resultBtn  : cc.Node,
        resultMask : cc.Mask,
    },

    init(data){
        this.game    = data.game;
        this.gameID  = data.id;
        this.isOver  = data.complete;

        this.resultLayer.active = false;
        this.submitBtn.active   = true;

        this.drawScore = 0;
        this.embroideryScore = 0;
        this.draw.spriteFrame = null;
        this.initView();
        this.initDemo();
        this.addEvent();
    },

    addEvent(){
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    clear(){
        this.drawScore = 0;
        this.embroideryScore = 0;
        this.draw.spriteFrame = null;
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    game_go_home(){

    },

    initDemo(){
        if(!cc.vv.clothesDemoWhite){
            Log.catch('err in putClothesTabMgr 36', cc.vv.clothesDemoWhite);
            return;
        }
        if(!this._initDemo){
            let textureWhite = cc.vv.clothesDemoWhite;
            let textureDemo  = cc.vv.clothesDemo;
            this.demo.spriteFrame       = new cc.SpriteFrame(textureWhite);
            this.resultMask.spriteFrame = new cc.SpriteFrame(textureWhite);
            this.resultDemo.spriteFrame = new cc.SpriteFrame(textureDemo);
            this.resultDemoWhite.spriteFrame = new cc.SpriteFrame(textureWhite);

            this.resultMask.node.width  = textureWhite.width;
            this.resultMask.node.height = textureWhite.height;

            this._initDemo = true;
        }

    },

    initView(){
        let drawData       = cc.vv.gameMgr.getPerformDrawData();
        let embroideryData = cc.vv.gameMgr.getPerformEmbroideryData();
        if(drawData){
            if(drawData.frame){
                this.draw.spriteFrame       = drawData.frame;
                this.resultDraw.spriteFrame = drawData.frame;
            }
            this.drawScore = drawData.score;
        }
        if(embroideryData){
            if(embroideryData.frame){
                this.embroidery.spriteFrame = embroideryData.frame;
                this.resultIcon.spriteFrame = embroideryData.frame;
            }
            this.embroideryScore = embroideryData.score;
        }
    },

    resultCallBack(){
        cc.vv.eventMgr.emit(cc.vv.eventName.complete_all_game);

        this.resultAniNode.active   = false;
        this.resultBtn.active       = false;
        this.resultScoreNode.active = false;

        let embroidery_angle = this.embroidery.node.angle;
        let embroidery_pos   = this.embroidery.node.getPosition();
        let embroidery_scale = this.embroidery.node.getScale();

        this.resultIcon.node.angle = embroidery_angle;
        embroidery_pos.x -= 21;
        embroidery_pos.y -= 63;
        this.resultIcon.node.setPosition(embroidery_pos);
        this.resultIcon.node.setScale(embroidery_scale);

        this.resultLayer.active     = true;
        let resultAni = this.resultAniNode.getComponent(cc.Animation);
        resultAni.stop();
        resultAni.on('finished',()=>{
            this.resultScoreNode.active = true;
            this.scoreRun();
            resultAni.off('finished',this);
        },this);
        resultAni.play();
        this.resultAniNode.active   = true;
    },

    scoreRun(){
        let base = 0;
        this.resultScore.string = base.toString();
        let score = Math.ceil((this.drawScore+this.embroideryScore)/2);
        score = this.score = score > 100 ? 100 : score < 0 ? 0 : score;
        let func = ()=>{
            if(base >= score){
                this.unschedule(func);
                this.resultBtn.active = true;
                return;
            }
            base+=1;
            this.resultScore.string = base.toString();
        }
        this.schedule(func, 0.05);
    },

    gameOverCallBack(){
        cc.vv.eventMgr.emit(cc.vv.eventName.game_settle_accounts, this.score / 100);
    },

    onDestroy(){
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

});
