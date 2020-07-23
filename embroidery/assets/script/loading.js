// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Log from './common/Log';
import {userMgr, userInfo} from './userInfo/userMgr';
import gameConfig from './entrance/entrance';
import eventName from './common/eventName';
import eventMgr from './common/eventMgr';
import utils from './common/utils';

import gameMgr from './gameMgr';

import audioMgr from './audioMgr';
import pushGameConfig from './PushGame/pushGameConfig';
import clothesMgr from './c_clothesConfig/clothesMgr';
import tiledMapMgr from './c_tiledMapConfig/tiledMapMgr';
import skinMgr from './c_skinConfig/skinMgr';
import jsbMgr from './jsb/jsbMgr'

cc.Class({
    extends: cc.Component,

    properties: {
        loading   : cc.Node,
        homeView  : cc.Node,
        commonTip : cc.Node,
        pushIcon: cc.Node,
        startBtn:cc.Node,
        loaddesc:cc.Label,
        loadprogress:cc.Label,
    },

    onLoad(){
        //在这里打开loading界面
        this.loading.active  = true;
        this.homeView.active = false;
        this.resReady        = true;
        this.resReadyFunc    = null;
      
        if(gameConfig.loadConfigOver){
            Log.d('游戏json场景前加载完毕');
            this.initData();
        }else{
            gameConfig.loadResolve = this.initData.bind(this);
        }

        cc.director.preloadScene('game');
    },

    initData(){
        if(!cc.vv){
            this.resReady   = false;//还没有准备资源
            cc.vv = {};
            //系统事件
            cc.vv.eventName = eventName;
            cc.vv.eventMgr  = eventMgr; 
            //用户信息 和 管理
            cc.vv.userMgr   = userMgr;
            cc.vv.userMgr.init(); //初始化userInfo
            cc.vv.userInfo  = userInfo;
            //音效
            cc.vv.audioMgr  = audioMgr;
            cc.vv.audioMgr.init();
            //常驻节点
            cc.game.addPersistRootNode(this.commonTip);
            cc.vv.commonTipMgr = this.commonTip.getComponent('commonTipMgr');
            //皮肤 和衣服刺绣等等的配置
            Log.d(gameConfig.part);
            Log.d(gameConfig.signin);
            Log.d(gameConfig.skin);
            Log.d(gameConfig.upgrade);
            cc.vv.utils = utils;
            cc.vv.upgrade      = gameConfig.upgrade;
            cc.vv.signinInfo   = gameConfig.signin;
            cc.vv.skinInfo     = null;
            cc.vv.pensSkin     = null;
            cc.vv.needlesSkin  = null;
            cc.vv.scissorsSkin = null;
            cc.vv.skinMgr      = skinMgr;
            cc.vv.skinMgr.init(gameConfig.skin);
            cc.vv.jsbMgr    = jsbMgr;

            //用户当前关卡的衣服资源          /***每关都会重新刷新的资源***/
            cc.vv.clothesDemo      = null;  /**texture                */
            cc.vv.clothesDemoWhite = null;  /**texture                */
            cc.vv.clothesClipArr   = [];    /**[texture]              */
            cc.vv.resourceUrl = "";
            
            cc.vv.clothesConfig = null;
            cc.vv.pensAsset     = null;      // {key: spriteFrame}
            cc.vv.clothesMgr    = clothesMgr;
            cc.vv.clothesMgr.init(gameConfig.part);
            //用户当前的刺绣资源              /***每关都会重新刷新的资源***/
            cc.vv.tiledMapDemo  = null;      /**tiledMap */
            cc.vv.tiledMapFrame = null;

            cc.vv.tiledMapConfig = null;
            cc.vv.linesAsset     = null;
            cc.vv.tiledMapMgr    = tiledMapMgr;
            cc.vv.tiledMapMgr.init(gameConfig.part);
            //预加载游戏资源
            this.preLoadGameRes();

            //加载home资源
        }

        this.node.getChildByName("tipView").getComponent("tipMgr").initHome()

        //游戏相关操作依据
        cc.vv.gameMgr = new gameMgr();

        //在这里关闭loading界面 显示按钮并且初始化
        this.initView();
        this.configOver();
    },

    //提前加载游戏资源
    preLoadGameRes(){
        Promise.all([
            cc.vv.clothesMgr.preLoadClothes((donenum,totalnum)=>{
                this.loaddesc.string = "加载衣服:  ";
                this.loadprogress.string = (Math.floor(donenum / totalnum) * 100).toString() +  "%100";
            }),
            cc.vv.tiledMapMgr.preLoadTiledMap((donenum,totalnum)=>{
                this.loaddesc.string = "加载地图:  ";
                this.loadprogress.string = (Math.floor(donenum / totalnum) * 100).toString() +  "%100";
            }),
            cc.vv.skinMgr.preLoadPensSkin((donenum,totalnum)=>{
                this.loaddesc.string = "加载笔刷:  ";
                this.loadprogress.string = (Math.floor(donenum / totalnum) * 100).toString() +  "%100";
            }),
            cc.vv.skinMgr.preLoadScissorsSkin((donenum,totalnum)=>{
                this.loaddesc.string = "加载剪刀:  ";
                this.loadprogress.string = (Math.floor(donenum / totalnum) * 100).toString() +  "%100";
            }),
            cc.vv.skinMgr.preLoadNeedlesSkin((donenum,totalnum)=>{
                this.loaddesc.string = "加载织针:  ";
                this.loadprogress.string = (Math.floor(donenum / totalnum) * 100).toString() +  "%100";
            }),
        ]).then(()=>{
            console.log("cc.vv.eventMgr========")
            this.startBtn.active = true;
            this.loaddesc.node.active = false;
            this.loadprogress.node.active = false;
            this.resReady = true;
            this.resReadyFunc && this.resReadyFunc();
            cc.vv.jsbMgr.init();
            this.initPushGame();
            Log.d(cc.vv.linesAsset);
        })
    },

    configOver(){
        this.loading.active  = false;
        this.homeView.active = true;
    },

    startGame(){
        ////this.loading.active  = true;
        ////this.homeView.active = false;
        if(this.resReady){
            this.openGameScene();
        }else{
            this.resReadyFunc = this.openGameScene.bind(this);
        }
    },

    openGameScene(){
        cc.director.loadScene('game',()=>{
            Log.d('game scene loaded');
        })
    },

    initView(){
        this.homeView.getComponent('homeMgr').init();
    },

    initPushGame(){
        let canshow = cc.vv.jsbMgr.gamePushOther();
        if(!canshow){
            return
        }
     
        cc.vv.pushGameConfig = pushGameConfig;
        cc.vv.pushGameConfig.initMutualPushFlag().then(()=>{
            return cc.vv.pushGameConfig.initMiConfig();
        }).then((data)=>{
            cc.vv.mutual_push = data[0];
            cc.vv.size_grid   = data[1];
            cc.vv.wheel_planting = data[2];
            this.initMutualPush();
            this.initWheelIcon();
        })
    },

    initMutualPush(){
      
        if(cc.vv.mutual_push.list && cc.vv.mutual_push.list.length){
            cc.vv.eventMgr.emit(eventName.push_game_tip_2_open);
        }
    },

    initWheelIcon(){
        if (!this.active) {
            return;
        }
        this.pushIcon.active = false;
        if(cc.vv.wheel_planting.list && cc.vv.wheel_planting.list.length){
            let list = cc.vv.wheel_planting.list;
            let times= cc.vv.wheel_planting.times;
            let startIdx = 1;
            this.wheelApkname = '';

            this.wheelIconPlay = ()=>{
                ////if(!list[startIdx].url){startIdx = 0};
                
                let n = list[startIdx];
               
                if(!n.icon) {
                   
                    this.scheduleOnce(this.wheelIconPlay,times[startIdx]||2);
                    startIdx = (startIdx+1) % list.length;
                  
                    return;
                }

                let url  = n.icon;
              
                let icon = this.pushIcon.getChildByName('icon').getComponent(cc.Sprite);
                let name = this.pushIcon.getChildByName('name').getComponent(cc.Label);
                cc.vv.utils.loadSpriteFrameByHttp(url,icon,94,94).then(()=>{
                    let time = times[startIdx];
                    let _name = list[startIdx].name;
                    name.string = _name;
                    this.wheelApkname = list[startIdx].apk;
                   /// this.pushIcon.getChildByName("icon").width = 94;
                   /// this.pushIcon.getChildByName("icon").height = 94;
                    this.pushIcon.active = true;
                    startIdx = (startIdx+1) % list.length ;
                   
                    if(startIdx ==0) {
                        startIdx = 1;
                    }
                    this.scheduleOnce(this.wheelIconPlay, time);
                })
            }

            this.wheelIconPlay();
        }
    },

    wheelIconCallBack(){
        if(this.wheelApkname){
            cc.vv.jsbMgr.openGame(this.wheelApkname);
        }
    },

});
