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

cc.Class({
    extends: cc.Component,

    properties: {
        tabNodes: cc.Node,
        tabBtns : [cc.Node],

        tabBtnFrames_n: [cc.SpriteFrame],
        tabBtnFrames_s: [cc.SpriteFrame],
    },

    onLoad(){
        this.gameMgr = cc.vv.gameMgr;
        this.openTabID = tailorTabID;

        this.tabMgr = this.tabNodes.getComponent('tabMgr');
        this.tabMgr.init(this);

        this.addEvent();
        this.initTabBtn();
        this.initTabView();
    },

    addEvent(){
        cc.vv.eventMgr.on(cc.vv.eventName.complete_one_game, this.complete_one_game, this);
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    removeEvent(){
        cc.vv.eventMgr.off(cc.vv.eventName.complete_one_game, this.complete_one_game, this);
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },


    initTabBtn(){
        for(let index = 0; index < this.tabBtns.length; index++){
            let item  = this.tabBtns[index];
            let light = this.gameMgr.canSelect(index);
            item.getComponent(cc.Sprite).spriteFrame = light ? this.tabBtnFrames_s[index] : this.tabBtnFrames_n[index];
            item.setScale(cc.v2(1,1));
        }
        let id = Number(this.openTabID);
        this.tabBtns[id].setScale(cc.v2(1.3,1.3));
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
        }
        let can_select = this.gameMgr.canSelect(selectID);
        if(can_select){
            this.openTabID = id;
            this.initTabBtn();
            this.initTabView();
        }
    },

    complete_one_game(id){
        this.gameMgr.completeAnyOne(id);
        this.initTabBtn();
        let isOver = this.gameMgr.completeGames();
        if(isOver){

            Log.d('当前游戏关卡 游戏结束！')
        }
    },

    game_go_home(){
        Log.d('返回大厅');
        this.removeEvent();
    },

    goHome(){
        if(this.gameMgr){
            //暂存draw数据 画板的data
            cc.vv.eventMgr.emit(cc.vv.eventName.game_go_home);
            cc.director.loadScene('home', () => {
                Log.d('home scene loaded');
            })
        }
    }

});
