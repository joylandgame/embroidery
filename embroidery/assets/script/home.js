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

cc.Class({
    extends: cc.Component,

    properties: {
        loading: cc.Node,
        btnLayer: cc.Node,
    },

    onLoad(){
        //在这里打开loading界面
        this.loading.active  = true;
        this.btnLayer.active = false;

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
            cc.vv = {};
            //系统事件
            cc.vv.eventName = eventName;
            cc.vv.eventMgr  = eventMgr; 
            //用户信息 和 管理
            cc.vv.userMgr   = userMgr;
            cc.vv.userMgr.init(); //初始化userInfo
            cc.vv.userInfo  = userInfo;

            //配置信息 json
            cc.vv.config_1 = gameConfig.config_1;
            cc.vv.config_2 = gameConfig.config_2;
            cc.vv.config_3 = gameConfig.config_3;
        }

        //用户当前关卡的衣服资源
        cc.vv.gameDemo = null;      // texture
        cc.vv.gameDemoWhite = null; // texture
        cc.vv.gameClipArr   = [];   // [ texture ]

        //游戏相关操作依据
        cc.vv.gameMgr = new gameMgr();

        this.resReady = false;
        this.resReadyFunc = null;
        this.preLoadGameRes();

        Log.d(cc.vv.config_1);
        Log.d(cc.vv.config_2);
        Log.d(cc.vv.config_3);
        Log.d(cc.vv.userInfo);

        //在这里关闭loading界面 显示按钮并且初始化
        this.configOver();
    },

    //提前加载游戏资源
    preLoadGameRes(){
        let url = 'clothes/';
        utils.loadDir(url).then((asset)=>{
            if(!asset || !asset.length){
                Log.catch('err in home 78, 预加载资源[]/err');
                return;
            }
            for(let i = 0; i < asset.length; i++){
                if(asset[i].name == 'demo'){
                    cc.vv.gameDemo = asset[i];
                    continue;
                }
                if(asset[i].name == 'white'){
                    cc.vv.gameDemoWhite = asset[i];
                    continue;
                }
                if(asset[i].name.split('_')[0] == 'clip' 
                || asset[i].name.split('_')[0] == 'line'){
                    cc.vv.gameClipArr.push(asset[i]);
                    continue;
                }
                Log.warn('加载资源时warn', asset[i]);
            }

            //全部是 texture2d 不是spriteFrame
            Log.d(cc.vv.gameDemo);
            Log.d(cc.vv.gameDemoWhite);
            Log.d(cc.vv.gameClipArr);

            this.resReady = true;
            this.resReadyFunc && this.resReadyFunc();
        })
    },

    configOver(){
        this.loading.active  = false;
        this.btnLayer.active = true;
    },

    startGame(){
        this.loading.active  = true;
        this.btnLayer.active = false;
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
    }



});
