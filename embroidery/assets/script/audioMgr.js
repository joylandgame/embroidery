

var audioMgr = {
    bgm: '',
    bgmId: '',

    change: '',
    cut: '',
    sell: '',
    spray: '',
    stitch: '',
    throw: '',
    victory: '',

    effectId: {},

    init: ()=>{
        cc.loader.loadRes('audio/bgm', cc.AudioClip, function (err, clip) {
            audioMgr.bgm = clip;
            let open = cc.vv.userInfo.openBgm;
            if(open == 'true'){
                audioMgr.playBgm();
            }
        });
    
        cc.loader.loadRes('audio/change', cc.AudioClip, function (err, clip) {
            audioMgr.change = clip;
        });
        cc.loader.loadRes('audio/cut', cc.AudioClip, function (err, clip) {
            audioMgr.cut = clip;
        });
        cc.loader.loadRes('audio/sell', cc.AudioClip, function (err, clip) {
            audioMgr.sell = clip;
        });
        cc.loader.loadRes('audio/spray', cc.AudioClip, function (err, clip) {
            audioMgr.spray = clip;
        });
        cc.loader.loadRes('audio/stitch', cc.AudioClip, function (err, clip) {
            audioMgr.stitch = clip;
        });
        cc.loader.loadRes('audio/throw', cc.AudioClip, function (err, clip) {
            audioMgr.throw = clip;
        });
        cc.loader.loadRes('audio/victory', cc.AudioClip, function (err, clip) {
            audioMgr.victory = clip;
        });
    },

    playEffect(name){
        let open = cc.vv.userInfo.openEffect;
        if(open == 'false'){
            return;
        }
        if(name == 'change' && audioMgr.change){
            cc.audioEngine.play(audioMgr.change, false);
        }
        if(name == 'cut' && audioMgr.cut){
            audioMgr.effectId['cut'] = cc.audioEngine.play(audioMgr.cut, true);
        }
        if(name == 'sell' && audioMgr.sell){
            cc.audioEngine.play(audioMgr.sell, false);
        }
        if(name == 'spray' && audioMgr.spray){
            audioMgr.effectId['spray'] = cc.audioEngine.play(audioMgr.spray, true);
        }
        if(name == 'stitch' && audioMgr.stitch){
            audioMgr.effectId['stitch'] = cc.audioEngine.play(audioMgr.stitch, true);
        }
        if(name == 'throw' && audioMgr.throw){
            cc.audioEngine.play(audioMgr.throw, false);
        }
        if(name == 'victory' && audioMgr.victory){
            cc.audioEngine.play(audioMgr.victory, false);
        }
    },

    stopEffect(name){
        let id = audioMgr.effectId[name];
        if(id){
            cc.audioEngine.stop(id);
        }
    },

    stopAllEffect(){
        for(let key in audioMgr.effectId){
            let id = audioMgr.effectId[key];
            cc.audioEngine.stop(id);
        }
    },

    playBgm: ()=>{
        if(audioMgr.bgmId){
            cc.audioEngine.resume(audioMgr.bgmId);
            return;
        }
        if(!audioMgr.bgm){return}
        audioMgr.bgmId = cc.audioEngine.play(audioMgr.bgm, true, 1);
    },

    stopBgm: ()=>{
        cc.audioEngine.pauseAll()
    }
}

export default audioMgr;