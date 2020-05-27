// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Log from '../common/Log';
import signinMgr from '../userInfo/signin';
cc.Class({
    extends: cc.Component,

    properties: {
        itemArr: [cc.Node],
        getBtn : cc.Node,
        getDoubleBtn: cc.Node,
    },

    init(){
        let signinInfo = cc.vv.signinInfo;
        if(!signinInfo){
            Log.catch('err in signinTipMgr 32, cc.vv.signinInfo = ', cc.vv.signinInfo);
            return
        }
        let todayIsSignin = signinMgr.todayIsSignin();
        let signinTimes   = signinMgr.getSigninTimes();
        let lightIndex    = signinTimes + 1;
        
        for(let i = 1; i < signinInfo.length; i++){
            if(i != 7){
                let bg = this.itemArr[i].getChildByName('signinTodayBg');
                let over = this.itemArr[i].getChildByName('signinover');
                let gold = this.itemArr[i].getChildByName('gold').getComponent(cc.Label);
                bg.active   = (lightIndex == i && !todayIsSignin);
                over.active = i < lightIndex;
                gold.string = "金币"+signinInfo[i].reward_gold;
            }
        }

        this.signinGetInfo = null;
        this.getBtn.active = false;
        this.getDoubleBtn.active = false;
        if(!todayIsSignin){
            this.signinGetInfo = signinInfo[lightIndex];
            this.signinItem    = this.itemArr[lightIndex];
            let change = Math.random()>0.5?true:false;
            this.getDoubleBtn.x = 150;
            this.getBtn.x = -150;
            if(change){
                this.getDoubleBtn.x = -150;
                this.getBtn.x = 150;
            }
            this.getBtn.active = true;
            this.getDoubleBtn.active = true;
        }

        this.node.active = true;
    },

    overCall(){
        let target  = this.signinItem;
        let bg      = target.getChildByName('signinTodayBg');
        let over    = target.getChildByName('signinover');
        bg.active   = false;
        over.active = true;
        this.getDoubleBtn.active = false;
        this.getBtn.active       = false;
        cc.vv.eventMgr.emit(cc.vv.eventName.system_signin_over);
        this.close();
    },

    getBtnCall(){
        if(!this.signinGetInfo || !this.signinItem){
            cc.vv.commonTipMgr.show('今日已签到');
            return;
        }
        this.getCall(1);
    },

    getDoubleBtnCall(){
        if(!this.signinGetInfo || !this.signinItem){
            cc.vv.commonTipMgr.show('今日已签到');
            return;
        }
        this.getCall(2);
    },

    getCall(base){
        let gold   = this.signinGetInfo.reward_gold;
        let skinId = this.signinGetInfo.reward_skinid;
        if(this.signinGetInfo.reward_skinid != cc.vv.skinMgr.defaultKey){
            let skinInfo = cc.vv.skinMgr.getSkinInfoById(skinId);
            let key = skinInfo.type;
            let id  = skinInfo.id;
            switch(key){
                case cc.vv.skinMgr.scissorKey:
                    cc.vv.skinMgr.setUserScissors(id);
                    break;
                case cc.vv.skinMgr.penKey:
                    cc.vv.skinMgr.setUserPens(id);
                    break;
                case cc.vv.skinMgr.needleKey:
                    cc.vv.skinMgr.setUserNeedles(id);
                    break;
            }
        }
        cc.vv.userMgr.addUserGold(gold * base);
        cc.vv.commonTipMgr.show(base === 1?this.signinGetInfo.destext:this.signinGetInfo.destext_double);
        
        signinMgr.setUserSigninInfo();
        this.overCall();
    },

    close(){
        this.node.active = false;
    }
});
