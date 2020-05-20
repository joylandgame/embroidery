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
    },

    onLoad(){
        this.gameMgr = cc.vv.gameMgr;

        this.tabMgr = this.tabNodes.getComponent('tabMgr');
        this.tabMgr.init(this);

        let can = this.gameMgr.canSelect();
        this.openTabID = can ? drawTabID : tailorTabID;
        this.addEvent();
        this.initTabBtn();
        this.initTabView();
    },

    addEvent(){
        cc.vv.eventMgr.on(cc.vv.eventName.complete_one_game, this.complete_one_game, this);
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    onDestroy(){
        cc.vv.eventMgr.off(cc.vv.eventName.complete_one_game, this.complete_one_game, this);
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },


    initTabBtn(){
        let can = this.gameMgr.canSelect();
        this.tailorIcon.active = !can;
        this.tabBtns.active = can;
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
    },

    initTabView(){
        this.tabMgr.openTab(this.openTabID);
    },

    selectTab(evt,id){
        if(this.openTabID == id){return}
        let selectID = -1;
        switch(id){
            case tailorTabID:
                selectID = this.gameMgr.tailorID;
                break;
            case drawTabID:
                selectID = this.gameMgr.drawID;
                break;
            case embroideryTabID:
                selectID = this.gameMgr.embroideryID;
                break;
            case putEmbroideryTabID:
                selectID = this.gameMgr.putEmbroideryTabID;
                break;
        }
        this.openTabID = id;
        this.initTabBtn();
        this.initTabView();
    },

    complete_one_game(id){
        this.gameMgr.completeAnyOne(id);
        //完成一个阶段后 将阶段切换
        let nextID   = this.gameMgr.jumpToNextStage(id);
        switch(nextID){
            case this.gameMgr.drawID:
                nextID = drawTabID;
                break;
            case this.gameMgr.embroideryID:
                nextID = embroideryTabID;
                break;
            case this.gameMgr.putEmbroideryTabID:
                nextID = putEmbroideryTabID;
                break;
        }
        this.selectTab(null,nextID);
        this.initTabBtn();
        let isOver = this.gameMgr.completeGames();
        if(isOver){

            Log.d('当前游戏关卡 游戏结束！')
        }
    },

    game_go_home(){
        Log.d('返回大厅');
    },

    goHome(){
        if(this.gameMgr){
            //暂存draw数据 画板的data
            cc.vv.eventMgr.emit(cc.vv.eventName.game_go_home);
            cc.director.loadScene('home', () => {Log.d('home scene loaded')})
        }
    }

});
