// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Log from '../common/Log';
const sizeArr     = [0.25,0.3,0.25,0.5,0.35,0.4,0.45];
const angleArr    = [-30,-25,-20,-15,-10,0,0,0,0,15,20,25,30,-50,50];

const dressPosArrBig = [[0, 100],[0, 26],[-30, 0],[30, 0],[0, -67]];
const pantsPosArrBig = [[-27, 100],[0, 100],[27, 100],[-35, 75],[35,75]];
const sleevePosArrBig = [[-67,105],[-48,19],[-15,-58],[5,-122],[0, 105],
                        [67,105],[48,19],[15,-58],[-5,-122]];
const sweaterPosArrBig = [[-48,19],[-15,-58],[5,-122],[0, 105],
                      [48,19],[15,-58],[-5,-122]];

const dressPosArr = [[-65,125],[65,125],[-39, 112],[39,112],[-35, 10],[0, 30],[35, 10],[-41, -95],[0, -60],[41, 95],[-50, -125],[0, -125],[50, -125]];
const pantsPosArr = [[0, 100],[-50, 105],[50, 105],[53, 40],[-53, 40],[-50, -91],[50, -91],[-50, -23],[50, -23]];
const sleevePosArr = [[-72,0],[-54,75],[-25,10],[-40,-30],[-68,35],[-6,-60],[-18,-106],[5,-138],
                    [72,0],[54,75],[25,10],[40,-30],[68,35],[6,-60],[18,-106],[-5,-138]];
const sweaterPosArr = [[-43, 15],[-70, 100],[-141, -7],[-31, -28],[-61, 56],[-29, -76],[-45, -106],[-114, 53],
                    [43, 15],[70, 100],[141, -7],[31, -28],[61, 56],[29, -76],[45, -106],[114, 53]];
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

        resultIcon_demo : cc.Sprite,
        resultMask_demo : cc.Mask,

        resultTip: cc.Node,
        resultTip_demo: cc.Sprite,
        resultTip_tiledMap: cc.Sprite,
        
        readMapCamera: cc.Camera,

        guide: cc.Node,
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
        this.putDemoData = null;

        this.initView();
        this.initDemo();
        this.initPutDemoTip();
        this.addEvent();
    },

    addEvent(){
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
        cc.vv.eventMgr.off(cc.vv.eventName.close_moveScale_guide, this.hideGuide, this);
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);
        cc.vv.eventMgr.on(cc.vv.eventName.close_moveScale_guide, this.hideGuide, this);
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
            this.resultMask_demo.spriteFrame = new cc.SpriteFrame(textureWhite);
            this.resultDemo.spriteFrame = new cc.SpriteFrame(textureDemo);
            this.resultDemoWhite.spriteFrame = new cc.SpriteFrame(textureWhite);
            this.resultTip_demo.spriteFrame  = new cc.SpriteFrame(textureDemo);
            this.resultMask.node.width  = textureWhite.width;
            this.resultMask.node.height = textureWhite.height;
            this.resultMask_demo.node.width  = textureWhite.width;
            this.resultMask_demo.node.height = textureWhite.height;
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

        let texture = new cc.RenderTexture();
        texture.initWithSize(640,640,cc.gfx.RB_FMT_S8);
        this.readMapCamera.targetTexture = texture;

        this.showGuide(1);
    },

    initPutDemoTip(){
        if(this.resultTip_tiledMap.spriteFrame){
            return;
        }
        let tiledMapNode = new cc.Node();
        tiledMapNode.zIndex = -100;
        let tiledMap = tiledMapNode.addComponent(cc.TiledMap);
        tiledMap.tmxAsset = cc.vv.tiledMapDemo;
        tiledMapNode.parent = this.game.node;
        tiledMapNode.group = "layerdemo";
        this.scheduleOnce(()=>{
            this.readMapCamera.render();
            let renderTexture = this.readMapCamera.targetTexture;
            let info  = renderTexture.readPixels();
            tiledMapNode.destroy();
            let img = new cc.Texture2D();
            img.initWithData(info, 16, 640, 640);
            let frame = new cc.SpriteFrame(img);
            frame.setFlipY(true);
            this.resultTip_tiledMap.spriteFrame = frame;
            let str  = cc.vv.clothesConfig.resource;
            let name = str.replace(/\d+/g,'');
            let data = {
                scale: 0,
                pos: [],
                angle: 0,
            };
            data['scale'] = sizeArr[Math.floor(Math.random()*(sizeArr.length))];
            data['angle'] = angleArr[Math.floor(Math.random()*(angleArr.length))];
            switch(name){
                case 'dress':
                    if(data['scale']<0.2){
                        data['pos'] = dressPosArr[Math.floor(Math.random()*(dressPosArr.length))];
                    }else{
                        data['pos'] = dressPosArrBig[Math.floor(Math.random()*(dressPosArrBig.length))];
                    }
                    break;
                case 'pants':
                    if(data['scale']<0.2){
                        data['pos'] = pantsPosArr[Math.floor(Math.random()*(pantsPosArr.length))];
                    }else{
                        data['pos'] = pantsPosArrBig[Math.floor(Math.random()*(pantsPosArrBig.length))];
                    }
                    break;
                case 'sleeve':
                    if(data['scale']<0.2){
                        data['pos'] = sleevePosArr[Math.floor(Math.random()*(sleevePosArr.length))];
                    }else{
                        data['pos'] = sleevePosArrBig[Math.floor(Math.random()*(sleevePosArrBig.length))];
                    }                
                    break;
                case 'sweater':
                    if(data['scale']<0.2){
                        data['pos'] = sweaterPosArr[Math.floor(Math.random()*(sweaterPosArr.length))];
                    }else{
                        data['pos'] = sweaterPosArrBig[Math.floor(Math.random()*(sweaterPosArrBig.length))];
                    }               
                    break;
            }

            this.resultTip_tiledMap.node.x = data.pos[0];
            this.resultTip_tiledMap.node.y = data.pos[1];
            this.resultTip_tiledMap.node.setScale(cc.v2(data.scale, data.scale));
            this.resultTip_tiledMap.node.angle = data.angle;

            this.resultIcon_demo.spriteFrame = frame;
            this.resultIcon_demo.node.x   = data.pos[0];
            this.resultIcon_demo.node.y   = data.pos[1];
            this.resultIcon_demo.node.setScale(cc.v2(data.scale, data.scale));
            this.resultIcon_demo.node.angle = data.angle;

            this.randomPutData = data;
            Log.d('random scale :', data);

            this.resultTip_demo.node.y = 120;
            this.resultTip_demo.node.scale = 0.45;

            this.scheduleOnce(()=>{
                this.resultTip.y = cc.winSize.height / 2;
                let offset     = this.resultTip.y - this.resultTip.height + 60
                this.resultTip.runAction(
                    cc.moveTo(0.5,this.resultTip.x,offset).easing(cc.easeBackOut())
                )
            },0.018)
        }, 0)
        
    },

    resultCallBack(){
        
        cc.vv.eventMgr.emit(cc.vv.eventName.complete_all_game);

        this.resultAniNode.active   = false;
        this.resultBtn.active       = false;
        this.resultScoreNode.active = false;

        let randomAngle = this.randomPutData.angle;
        let randomX     = this.randomPutData.pos[0];
        let randomY     = this.randomPutData.pos[1];
        let randomScale = this.randomPutData.scale;

        let putAngle = this.embroidery.node.angle;
        let putX     = this.embroidery.node.x - 21;
        let putY     = this.embroidery.node.y - 63;
        let putScale = this.embroidery.node.scale;

        Log.d(
            "randomAngle - putAngle " + randomAngle + " - " + putAngle + "\n",
            "randomX - putX " + randomX + " - " + putX + "\n",
            "randomY - putY " + randomY + " - " + putY + "\n",
            "randomScale - putScale " + randomScale + " - " + putScale,
        )
        
        this.resultIcon.node.angle = putAngle;
        this.resultIcon.node.setScale(cc.v2(putScale,putScale));
        this.resultIcon.node.setPosition(cc.v2(putX,putY));

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
        this.schedule(func, 0.02);
    },

    gameOverCallBack(){
        cc.vv.eventMgr.emit(cc.vv.eventName.game_settle_accounts, this.score / 100);
    },

    onDestroy(){
        cc.vv.eventMgr.off(cc.vv.eventName.close_moveScale_guide, this.hideGuide, this);
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },
   
    showGuide(index){
        if(cc.vv.userInfo.guide && cc.vv.userInfo.guide['3']){
            return;
        }
        if(index == 1){
            this.guide.active = true;
        }
    },

    hideGuide(){
        this.guide.active = false;
        cc.vv.userMgr.setUserGudie('3');
    }
});
