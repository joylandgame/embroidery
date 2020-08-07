import vivo from './vivo';
import oppo from './oppo';
import web from './web';



var jsb    = null;
var initFunc = function(platform) {
     console.log("cc.sys.vivoGame======",cc.sys.platform);
    if(cc.sys.MOBILE_BROWSER == platform || cc.sys.DESKTOP_BROWSER == platform){
        console.log("web========")
        jsb = require("./web.js");
    }
    if(cc.sys.VIVO_GAME == platform){
        jsb  = vivo;
    }
    if(cc.sys.OPPO_GAME == platform){
        jsb = oppo;
    }
    if(cc.sys.WECHAT_GAME == platform) {
        console.log("wechat");
        jsb =  require("./weixin.js")
    }
    if("toutiao" === platform) {
        console.log("toutiao")
        jsb = require("./toutiao.js");
    }
}


const jsbMgr = {

    loop: '',

    init(){
        if(jsb == null){
            console.error("jsb is empty")
            return;
        }
        jsb.init();
        jsb.loadBannerView();
        jsb.loadRewardVideo();
        jsb.loadInsert();
        jsb.initNativeAd();
    },

    gamePushOther(){
        
        if(cc.sys.OPPO_GAME != cc.sys.platform && cc.sys.MOBILE_BROWSER != cc.sys.platform && cc.sys.DESKTOP_BROWSER != cc.sys.platform){
            console.log('不是oppo');
            return false;
        }
        
        return true
    },

    play(type, call){
        if(jsb == null){
            call && call(1);
            return;
        }
        switch(type){
            case 'showRewardVideo':
                return jsb.showRewardVideo(call);
            break;

            case 'showBanner':
                return jsb.showBanner();
            break;

            case 'showInstertView':
                return jsb.showInstertView();
            break;

            case 'showBanner':
                return jsb.showBanner();
            break;
            case 'showNativeAdView':
                return jsb.showNativeAdView();
            break;    
        }
    },

    otherFeatures(type,call){
        if(jsb == null){
            call && call('none');
            return false;
        }
        switch(type){
            case 'hasShortcutInstalled':
                jsb.hasShortcutInstalled(call);
            break;

            case 'openVibrateShort':
                jsb.openVibrateShort(call);
            break;

            case 'sendDesktop':
                jsb.sendDesktop(call);
            break;
        }
    },

    openGame(name){
        if(!jsb||!jsb.openGame){return console.log('非native||非oppo手机')}
        jsb.openGame(name);
        console.log('用户跳转游戏',name);
    },

    closeBanner(){
        if(jsb == null){
            return;
        }

        jsb.hideBannder();
    },
    getNativeAd() {
        if(jsb) {
            return 
        }
    }
}

export default {
    jsbMgr:jsbMgr,
    initFunc:initFunc
};