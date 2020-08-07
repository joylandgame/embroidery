// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import Log from './common/Log';

const tailorTabID     = '0';
const drawTabID       = '1';
const embroideryTabID = '2';
const putEmbroideryTabID = '3';


cc.Class({
    extends: cc.Component,

    properties: {

        tailorIcon: cc.Node,

        tabNodes: cc.Node,

        tabBtns: cc.Node,
        tabBgs : [cc.Sprite],
        tabIcons: [cc.Sprite],
        tabBgSpr: [cc.SpriteFrame],

        tabBtnFrames_n: [cc.SpriteFrame],
        tabBtnFrames_s: [cc.SpriteFrame],

        goHomeBtn: cc.Node,

        saleTip: cc.Node,

        camera: cc.Camera,
    },

    onLoad(){
        this.tabMgr = this.tabNodes.getComponent('tabMgr');
        this.tipMgr =  this.node.getChildByName("tipView").getComponent("tipMgr");
        this.tipMgr.initGame();
    
        this.tabMgr.init(this);
        this.initView();
        this.addEvent();
    },

    initView(){
        let can = cc.vv.gameMgr.canSelect();
        /////this.openTabID = can ? drawTabID : tailorTabID;
        this.openTabID = '0';
        this.tabBtns.active   = true;
        this.goHomeBtn.active = true;
        this.initTabBtn();
        this.initTabView();
    },

    addEvent(){
        cc.vv.eventMgr.on(cc.vv.eventName.complete_all_game, this.complete_all_game, this);
        cc.vv.eventMgr.on(cc.vv.eventName.complete_one_game, this.complete_one_game, this);
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);
        cc.vv.eventMgr.on(cc.vv.eventName.game_settle_accounts, this.game_settle_accounts, this);
        cc.vv.eventMgr.on(cc.vv.eventName.last_game_done,this.lastGameDone,this);
    },

    onDestroy(){
        cc.vv.eventMgr.off(cc.vv.eventName.complete_all_game, this.complete_all_game, this);
        cc.vv.eventMgr.off(cc.vv.eventName.complete_one_game, this.complete_one_game, this);
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
        cc.vv.eventMgr.off(cc.vv.eventName.game_settle_accounts, this.game_settle_accounts, this);
        cc.vv.eventMgr.off(cc.vv.eventName.last_game_done,this.lastGameDone,this);

    },


    initTabBtn(){
        let can = cc.vv.gameMgr.canSelect();
        /*
        this.tailorIcon.active = !can;
        this.tabBtns.active = can;
        */
        /*
        if(can){
            for (let index = 0; index < this.tabBgs.length; index++){
                this.tabBgs[index].spriteFrame = this.tabBgSpr[0];
            }
            for (let index = 0; index < this.tabIcons.length; index++) {
                this.tabIcons[index].spriteFrame = this.tabBtnFrames_n[index];
            }
            let id = Number(this.openTabID);
            this.tabBgs[id].spriteFrame = this.tabBgSpr[1];
            this.tabIcons[id].spriteFrame = this.tabBtnFrames_s[id];
        }
        */
       ///let info = cc.vv.gameMgr.confirmGameCompletion();

        for (let index = 0; index < this.tabBgs.length; index++){
            this.tabBgs[index].spriteFrame = this.tabBgSpr[0];
        }
        for (let index = 0; index < this.tabIcons.length; index++) {
            this.tabIcons[index].spriteFrame = this.tabBtnFrames_n[index];
        }

        ////console.log("info============",info)
        /*
        if (info.finalStep >=0) {
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx have")
            this.tabIcons[info.finalStep].spriteFrame = this.tabBtnFrames_s[info.finalStep];
            this.tabBgs[info.finalStep].spriteFrame = this.tabBgSpr[1];
        }
        */
        if (this.openTabID) {
            this.tabIcons[this.openTabID].spriteFrame = this.tabBtnFrames_s[this.openTabID];
            this.tabBgs[this.openTabID].spriteFrame = this.tabBgSpr[1];
        }        
        this.goHomeBtn.active = true;
    },

    initTabView(){
        this.tabMgr.showTrySkinTip(this.openTabID);
    },

    selectTab(evt,id){
        let info = cc.vv.gameMgr.confirmGameCompletion();
        if (id > info.finalStep) {return}
        if(this.openTabID == id){return}
        // let selectID = -1;
        // switch(id){
        //     case tailorTabID:
        //         selectID = cc.vv.gameMgr.tailorID;
        //         break;
        //     case drawTabID:
        //         selectID = cc.vv.gameMgr.drawID;
        //         break;
        //     case embroideryTabID:
        //         selectID = cc.vv.gameMgr.embroideryID;
        //         break;
        //     case putEmbroideryTabID:
        //         selectID = cc.vv.gameMgr.putEmbroideryTabID;
        //         break;
        // }
        this.openTabID = id;
        this.initTabBtn();
        this.initTabView();
    },

    complete_one_game(id){
        cc.vv.gameMgr.completeAnyOne(id);
        //完成一个阶段后 将阶段切换
        let nextID   = cc.vv.gameMgr.jumpToNextStage(id);
        switch(nextID){
            case cc.vv.gameMgr.drawID:
                nextID = drawTabID;
                break;
            case cc.vv.gameMgr.embroideryID:
                nextID = embroideryTabID;
                break;
            case cc.vv.gameMgr.putEmbroideryTabID:
                nextID = putEmbroideryTabID;
                break;
        }
        this.selectTab(null,nextID);
        this.initTabBtn();
        let info = cc.vv.gameMgr.confirmGameCompletion();
        if(info.complete){
            Log.d('当前游戏关卡 游戏结束！')
            //准备下一个关卡
            // this.readyGoNext();
            console.log("===============================")
        }
    },

    complete_all_game(){
        console.log("complete_all_game=====")
        this.tabBtns.active   = false;
        this.goHomeBtn.active = false;
    },
    lastGameDone() {
        this.complete_all_game();
    },
    game_go_home(){
        Log.d('返回大厅');
        cc.vv.audioMgr.stopAllEffect();
    },

    goHome(){
        if(cc.vv.gameMgr){
            //暂存draw数据 画板的data
            cc.vv.eventMgr.emit(cc.vv.eventName.game_go_home);
            cc.director.loadScene('home', () => {Log.d('home scene loaded')})
        }
    },

    game_settle_accounts(score){
        let gold = Number(cc.vv.clothesConfig.gold) + Number(cc.vv.tiledMapConfig.gold);
        let scoreRatio = score;
        this.saleTip.getComponent('saleMgr').init(this, gold, scoreRatio);
        this.saleTip.active = true;
    },

    readyGoNext(){
        console.log("readyGoNext=====")
        let userLv = cc.vv.userInfo.level;
        cc.vv.userMgr.setUserLevel(userLv + 1);
        cc.vv.userMgr.clearUserGameInfo();
        cc.vv.gameMgr.clean();
        cc.vv.skinMgr.clearTrySkin();

        cc.vv.clothesDemo      = null;
        cc.vv.clothesDemoWhite = null;
        cc.vv.clothesClipArr   = []; 
        cc.vv.tiledMapDemo     = null;
        cc.vv.clothesConfig    = null;
        cc.vv.tiledMapConfig   = null;
        cc.vv.clothesDemoHint  = null; 
        cc.vv.resourceUrl = "";
        
        this.tabMgr.clearAllTab();

        Promise.all([
            cc.vv.clothesMgr.preLoadClothes(),
            cc.vv.tiledMapMgr.preLoadTiledMap()
        ]).then(()=>{
            this.initView();
        })
    },

    showNativeAd() {
        return new Promise((resolved,rejected)=>{
            resolved(false)
        })
        
        /*
        return new Promise((resolved,reject)=>{
            this.tipMgr.openNativeInsert().then((res)=>{
                if(res) {
                    console.log("showNativeAd==== true")
                    resolved(true)
                   
                } else {
                    console.log("showNativeAd==== false")
                    resolved(false)
                    Promise.resolved(false);
                }
            })
        })
        */
    }
});
