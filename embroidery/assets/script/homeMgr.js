// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import signinMgr from './userInfo/signin';
cc.Class({
    extends: cc.Component,

    properties: {
        upLevelBtn: cc.Node, 
        upLevelBtnSprs: [cc.Sprite],

        addDeskBtn: cc.Node,
        shopBtn: cc.Node,
        signinBtn: cc.Node,
        putGame: cc.Node,

        numbers: cc.SpriteAtlas,
    },

    init(){
        this.numbersFrames = this.numbers.getSpriteFrames();


        this.initUpLevelBtn();
        this.initSigninBtn();
    },

    upLevelBtnCall(){
        let lv = cc.vv.userInfo.upgradeLv;
        cc.vv.userMgr.setUserUpgradeLv(lv + 1);
        this.initUpLevelBtn();
    },

    initUpLevelBtn(){
        let lv = cc.vv.userInfo.upgradeLv;
        let _lv = lv.toString();
        for(let i = 0; i < _lv.length; i++){
            this.upLevelBtnSprs[i].spriteFrame = this.numbersFrames[_lv[i]];
        }
    },

    initSigninBtn(){
        let signinTimes = signinMgr.getSigninTimes();
        if(signinTimes >= 7){
            this.signinBtn.active = false;
            return;
        }
        let todayIsSignin = signinMgr.todayIsSignin();
        let tanHao = this.signinBtn.getChildByName('tanhao');
        tanHao.active = !todayIsSignin;
    }
});
