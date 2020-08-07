// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import utils from './common/utils';
import jsbMgr from './jsb/jsbMgr';

cc.Class({
    extends: cc.Component,

    properties: {
        loading: cc.Node,
        loadingAni: cc.Node,
    },

    onLoad(){
      
       
      
    },

    onDestroy() {
       
        cc.vv.eventMgr.off(cc.vv.eventName.push_game_tip_1_open,this.push_game_tip_1_open,this);
        cc.vv.eventMgr.off(cc.vv.eventName.push_game_tip_1_close,this.push_game_tip_1_close,this);
        cc.vv.eventMgr.off(cc.vv.eventName.push_game_tip_2_open,this.openPushTip_2,this);

    },

    initHome() {
        this.loading.active    = false;
        this.loadingAni.active = false;
        cc.vv.eventMgr.on(cc.vv.eventName.push_game_tip_2_open,this.openPushTip_2,this);
    },
    initGame() {
        cc.vv.eventMgr.on(cc.vv.eventName.push_game_tip_1_open,this.push_game_tip_1_open,this);
        cc.vv.eventMgr.on(cc.vv.eventName.push_game_tip_1_close,this.push_game_tip_1_close,this);
    },

    openShopView(){
        if(this.shopView){
            this.shopView.getComponent('shopTipMgr').init();
            return;
        }
        this.loading.active = true;
        this.loadingAni.active = true;
        utils.loadPrefab('./tipViewPrefab/shopTipView', this.node).then((node)=>{
            this.loading.active = false;
            this.loadingAni.active = false;
            this.shopView = node;
            this.shopView.getComponent('shopTipMgr').init();
        })
    },

    openSigninView(){
        if(this.signinView){
            this.signinView.active = true;
            return;
        }
        this.loading.active = true;
        this.loadingAni.active = true;
        utils.loadPrefab('./tipViewPrefab/signinTipView', this.node).then((node)=>{
            this.loading.active = false;
            this.loadingAni.active = false;
            this.signinView = node;
            this.signinView.getComponent('signinTipMgr').init();
        })
    },

    push_game_tip_1_open(){
        let canshow = cc.vv.jsbMgr.gamePushOther();
      
        if(!canshow){return}
      
        if(!cc.vv.size_grid.list || !cc.vv.size_grid.list.length){return}
        this.openPushTip_1();
    },

    push_game_tip_1_close(){
        let canshow = cc.vv.jsbMgr.gamePushOther();
        if(!canshow || !this.pushTip_1){return}
        if(!cc.vv.size_grid.list || !cc.vv.size_grid.list.length){return}
        this.pushTip_1.getComponent('pushTip_1Mgr').close();
    },

    openPushTip_1(){
        if(this.pushTip_1){
            this.pushTip_1.getComponent('pushTip_1Mgr').init();
            return;
        }
        cc.vv.utils.loadPrefab('./pushprefab/pushTip_1', this.node, null).then((node)=>{
            if(this.pushTip_1){return}
            this.pushTip_1 = node;
            this.pushTip_1.getComponent('pushTip_1Mgr').init();
        })
    },

    openPushTip_2(){
      
        if(this.pushTip_2){
            this.pushTip_2.getComponent('pushTip_2Mgr').init();
            return;
        }
        cc.vv.utils.loadPrefab('./pushprefab/pushTip_2', this.node, null).then((node)=>{
            if(this.pushTip_1){return}
            this.pushTip_2 = node;
            this.pushTip_2.getComponent('pushTip_2Mgr').init();
        })
    },
    openNativeInsert(callback) {
        /*
        if(this.nativeInsertView) {
            this.nativeInsertView.getComponent("nativeInsertMgr").init(callback);
            return;
        }
        console.log("原生 run openNativeInsert")
        cc.vv.utils.loadPrefab('./pushprefab/NativeInsertView',this.node,null).then((node)=>{
            console.log("原生加载完成")
            this.nativeInsertView = node;
            this.nativeInsertView.getComponent("nativeInsertMgr").init(callback);
        })
        */
       return new Promise((resolved,rejected)=>{
           let callback =  cc.vv.jsbMgr.play("showNativeAdView");
           if(this.nativeInsertView) {
                this.nativeInsertView.getComponent("nativeInsertMgr").init(callback).then((res)=>{
                    console.log("res openNativeInsert",res)
                    resolved(res);
                });
            }

            console.log("原生 run openNativeInsert")
            cc.vv.utils.loadPrefab('./pushprefab/NativeInsertView',this.node,null).then((node)=>{
                console.log("原生加载完成")
                this.nativeInsertView = node;
                this.nativeInsertView.getComponent("nativeInsertMgr").init(callback).then((res)=>{
                    console.log("res openNativeInsert[222]",res)
                    resolved(res);
                });
                
         }) 
       })
    }

});
