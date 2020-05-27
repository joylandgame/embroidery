// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import skinTryMgr from '../userInfo/skinTry';
var CALL = null;
cc.Class({
    extends: cc.Component,

    properties: {
        tryPen: cc.Node,
        penIcon: cc.Sprite,

        tryScissor: cc.Node,
        scissorIcon: cc.Sprite,

        tryNeedle: cc.Node,
        needleIcon: cc.Sprite,

        duiBg: cc.Node,
        duiHao: cc.Node,
        tryRandomBtn: cc.Node,
        tiaoGuoBtn: cc.Node,
    },
    // scissorKey : '1',
    // penKey     : '2',
    // needleKey  : '3',
    init(info, call){
        if(!info){return}
        CALL = call;
        this.duiBg.active  = info >= 3;
        this.duiHao.active = false;
        let scissorInfo = cc.vv.skinMgr.getTrySkin(cc.vv.skinMgr.scissorKey);
        let penInfo     = cc.vv.skinMgr.getTrySkin(cc.vv.skinMgr.penKey);
        let needleInfo  = cc.vv.skinMgr.getTrySkin(cc.vv.skinMgr.needleKey);
        
        this.tryScissor.active = false;
        this.tryNeedle.active  = false;
        this.tryPen.active     = false;
        this.tryRandomBtn.active = true;
        this.tiaoGuoBtn.active   = true;

        this.tryUseTimes = 0;

        if(!scissorInfo&&!penInfo&&!needleInfo){
            call && call();
            return;
        }
        if(scissorInfo){
            this.scissorIcon.spriteFrame = cc.vv.scissorsSkin[scissorInfo.skin_try_icon];
            this.scissorInfo = scissorInfo;
            this.tryUseTimes++;
            this.tryScissor.active = true;
        }
        if(penInfo){
            this.penIcon.spriteFrame = cc.vv.pensSkin[penInfo.skin_try_icon];
            this.penInfo = penInfo;
            this.tryUseTimes++;
            this.tryPen.active = true;
        }
        if(needleInfo){
            this.needleIcon.spriteFrame = cc.vv.needlesSkin[needleInfo.skin_try_icon];
            this.needleInfo = needleInfo;
            this.tryUseTimes++;
            this.tryNeedle.active = true;
        }
        this.node.active = true;
    },

    tryBtnCall(evt){
        this.penCall    = null;
        this.needleCall = null;
        this.scissorCall= null;
        switch(evt.target.name){
            case 'penTryBtn':
                if(this.penInfo){
                    //此处调用广告接口
                    this.penCall = (type)=>{
                        if(type != 1){
                            return;
                        }
                        this.tryPen.active = false;
                        cc.vv.skinMgr.setTrySkin(this.penInfo);
                        cc.vv.commonTipMgr.show('得到笔刷试用');
                        this.tryUseTimes --;
                        this.updateView();
                    }
                    this.penCall(1);
                }
                break;

            case 'scissorTryBtn':
                if(this.scissorInfo){
                    //此处调用广告接口
                    this.scissorCall = (type)=>{
                        if(type != 1){
                            return;
                        }
                        this.tryScissor.active = false;
                        cc.vv.skinMgr.setTrySkin(this.scissorInfo);
                        cc.vv.commonTipMgr.show('得到剪刀试用');
                        this.tryUseTimes --;
                        this.updateView();
                    }
                    this.scissorCall(1);
                }
                break;

            case 'needleTryBtn':
                if(this.needleInfo){
                    //此处调用广告接口
                    this.needleCall = (type)=>{
                        if(type != 1){
                            return;
                        }
                        this.tryNeedle.active = false;
                        cc.vv.skinMgr.setTrySkin(this.needleInfo);
                        cc.vv.commonTipMgr.show('得到刺针试用');
                        this.tryUseTimes --;
                        this.updateView();
                    }
                    this.needleCall(1);
                }
                break;
        }
    },

    tryRandomCall(){
        if(this.tryUseTimes != 0){
            let arr = [];
            if(this.needleInfo){
                arr.push(this.needleInfo);
            }
            if(this.scissorInfo){
                arr.push(this.scissorInfo);
            }
            if(this.penInfo){
                arr.push(this.penInfo);
            }
            let info = arr[Math.floor(Math.random()*arr.length)];

            this.randomCall = null;
            this.randomCall = (type)=>{
                if(type != 1){
                    return;
                }
                cc.vv.skinMgr.setTrySkin(info);
                let str  = info.name;
                let name = str.replace(/\d+/g,'');
                cc.vv.commonTipMgr.show('得到'+name+'试用');
                this.close();
            }
            this.randomCall(1);
        }
    },

    updateView(){
        this.tryRandomBtn.active = false;
        this.tiaoGuoBtn.active   = false;
        if(this.tryUseTimes <= 0){
            this.close();
        }
    },

    noShowCall(){
        if(this.noShow){
            this.noShow = false;
        }else{
            this.noShow = true;
        }
        this.duiHao.active = this.noShow;
    },

    close(){
        CALL && CALL();
        if(this.noShow){skinTryMgr.closeToday();}
        this.node.active = false;
    }

});
