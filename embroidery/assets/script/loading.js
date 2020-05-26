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

import clothesMgr from './c_clothesConfig/clothesMgr';
import tiledMapMgr from './c_tiledMapConfig/tiledMapMgr';
import skinMgr from './c_skinConfig/skinMgr';
cc.Class({
    extends: cc.Component,

    properties: {
        loading   : cc.Node,
        homeView  : cc.Node,
        commonTip : cc.Node,
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
            //常驻节点
            cc.game.addPersistRootNode(this.commonTip);
            cc.vv.commonTipMgr = this.commonTip.getComponent('commonTipMgr');
            //皮肤 和衣服刺绣等等的配置
            Log.d(gameConfig.part);
            Log.d(gameConfig.signin);
            Log.d(gameConfig.skin);
            Log.d(gameConfig.upgrade);

            cc.vv.upgrade      = gameConfig.upgrade;
            cc.vv.signinInfo   = gameConfig.signinInfo;
            cc.vv.skinInfo     = null;
            cc.vv.pensSkin     = null;
            cc.vv.needlesSkin  = null;
            cc.vv.scissorsSkin = null;
            cc.vv.skinMgr      = skinMgr;
            cc.vv.skinMgr.init(gameConfig.skin);

            //用户当前关卡的衣服资源          /***每关都会重新刷新的资源***/
            cc.vv.clothesDemo      = null;  /**texture                */
            cc.vv.clothesDemoWhite = null;  /**texture                */
            cc.vv.clothesClipArr   = [];    /**[texture]              */

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

        //游戏相关操作依据
        cc.vv.gameMgr = new gameMgr();

        //在这里关闭loading界面 显示按钮并且初始化
        this.initView();
        this.configOver();
    },

    //提前加载游戏资源
    preLoadGameRes(){
        Promise.all([
            cc.vv.clothesMgr.preLoadClothes(),
            cc.vv.tiledMapMgr.preLoadTiledMap(),
            cc.vv.skinMgr.preLoadPensSkin(),
            cc.vv.skinMgr.preLoadScissorsSkin(),
            cc.vv.skinMgr.preLoadNeedlesSkin(),
        ]).then(()=>{
            this.resReady = true;
            this.resReadyFunc && this.resReadyFunc();
            Log.d(cc.vv.linesAsset);
        })
    },

    configOver(){
        this.loading.active  = false;
        this.homeView.active = true;
    },

    startGame(){
        this.loading.active  = true;
        this.homeView.active = false;
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

});
