// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import utils from './common/utils';

cc.Class({
    extends: cc.Component,

    properties: {
        loading: cc.Node,
        loadingAni: cc.Node,
    },

    onLoad(){
        this.loading.active    = false;
        this.loadingAni.active = false;
    },

    openShopView(){
        if(this.shopView){
            this.shopView.active = true;
            return;
        }
        this.loading.active = true;
        this.loadingAni.active = true;
        utils.loadPrefab('./tipView/shopTip', this.node).then((node)=>{
            this.loading.active = false;
            this.loadingAni.active = false;
            this.shopView = node;
            this.shopView.geComponent('shopTipMgr').init();
        })
    },

    openSigninView(){

    },


});
