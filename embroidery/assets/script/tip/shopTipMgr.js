// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import awardingMgr from '../userInfo/awarding';
import Log from '../common/Log';

const viewType = {
    scissorTab: 'scissorTab',
    penTab    : 'penTab',
    needleTab : 'needleTab',
}

cc.Class({
    extends: cc.Component,

    properties: {
        pen_item: cc.Node,
        scissor_item: cc.Node,
        needle_item: cc.Node,

        penView: cc.Node,
        penContent: cc.Node,

        scissorView: cc.Node,
        scissorContent: cc.Node,

        needleView: cc.Node,
        needleContent: cc.Node,

        scissorTab  : cc.Sprite,
        penTab      : cc.Sprite,
        needleTab   : cc.Sprite,
        tabBgFrames : [cc.SpriteFrame], //0为未选中 1选中

        scissorSelected: cc.Sprite,
        penSelected    : cc.Sprite,
        needleSelected : cc.Sprite,
        scissorFrames : [cc.SpriteFrame],
        penFrames     : [cc.SpriteFrame],
        needleFrames  : [cc.SpriteFrame],

        goldNumber : cc.Node,

        numbers: cc.SpriteAtlas,
    },
    // {
    //     "type": "皮肤类型：1剪刀 2笔刷 3刺针",
    //     "id": "唯一标识",
    //     "name": "皮肤名字",
    //     "skin_res_name": "皮肤对应的资源名称",
    //     "unlock_type": "解锁条件：0默认解锁，1金币手动兑换，2签到解锁，3视频解锁",
    //     "unlock_need": "解锁要消耗的数量",
    //     "skin_try_icon": "皮肤试用界面的icon",
    //     "skin_try_weight": "试用皮肤随机权重"
    // },
    init(){

        this.openView = viewType.scissorTab;

        this.scissorView.active = false;
        this.penView.active     = false;
        this.needleView.active  = false;

        if(!this.scissorsArr){
            this.scissorsArr = [];
            this.initView(cc.vv.skinMgr.scissorKey, this.scissorsArr);
        }else{
            this.scissorsArr.forEach(e=>{
                let key  = cc.vv.skinMgr.scissorKey;
                let info = cc.vv.skinMgr.getSkinInfo(key, e._id);
                this.initItem(e, key, info);
            })
        }

        if(!this.pensArr){
            this.pensArr = [];
            this.initView(cc.vv.skinMgr.penKey, this.pensArr);
        }else{
            this.pensArr.forEach(e=>{
                let key  = cc.vv.skinMgr.penKey;
                let info = cc.vv.skinMgr.getSkinInfo(key, e._id);
                this.initItem(e, key, info);
            })
        }

        if(!this.needlesArr){
            this.needlesArr = [];
            this.initView(cc.vv.skinMgr.needleKey, this.needlesArr);
        }else{
            this.needlesArr.forEach(e=>{
                let key  = cc.vv.skinMgr.needleKey;
                let info = cc.vv.skinMgr.getSkinInfo(key, e._id);
                this.initItem(e, key, info);
            })
        }

        this.changeTabFrames();
        this.openSelectView();
        this.updateUserGold();
        this.node.active = true;
    },

    initView(typeKey, arr){
        let skinsInfo = cc.vv.skinMgr.getSkinsInfo(typeKey);
        let demo_item   = null;
        let demo_parent = null;
        
        switch(typeKey){
            case cc.vv.skinMgr.scissorKey:
                demo_parent = this.scissorContent;
                demo_item   = this.scissor_item;
            break;
            case cc.vv.skinMgr.penKey:
                demo_parent = this.penContent;
                demo_item   = this.pen_item;
            break;
            case cc.vv.skinMgr.needleKey:
                demo_parent = this.needleContent;
                demo_item   = this.needle_item;
            break;
        }

        if(!demo_item || !demo_parent){
            this.node.active = false;
            return Log.catch('err in shopTipMgr 128 demo_item/demo_parent key:', typeKey, demo_item, demo_parent)
        }

        for(let i = 0; i < skinsInfo.length; i++){
            let info = skinsInfo[i];
            let item = cc.instantiate(demo_item);
            let icon = item.getChildByName('icon').getComponent(cc.Sprite);
            this.iconSpriteFrame(icon, info);
            this.initItem(item, typeKey, info);
            item.type   = typeKey;
            item._id    = info.id;
            item.active = true;
            item.parent = demo_parent;
            arr.push(item);
        }
    },

    // cc.vv.pensSkin     = null;
    // cc.vv.needlesSkin  = null;
    // cc.vv.scissorsSkin = null;

    iconSpriteFrame(icon, info){
        switch(info.type){
            case cc.vv.skinMgr.penKey:
                icon.spriteFrame = cc.vv.pensSkin[info.skin_try_icon];
                break;
            case cc.vv.skinMgr.needleKey:
                icon.spriteFrame = cc.vv.needlesSkin[info.skin_try_icon];
                break;
            case cc.vv.skinMgr.scissorKey:
                icon.spriteFrame = cc.vv.scissorsSkin[info.skin_try_icon];
                break;
        }
    },

    initItem(item, typeKey, info){
        let buyBtn = item.getChildByName('buyBtn');
        let videoBtn = item.getChildByName('videoBtn');
        let signinBtn = item.getChildByName('signinBtn');
        let useBtn = item.getChildByName('useBtn');
        let usingBtn = item.getChildByName('usingBtn');
        let use_id   = -1;
        let have_ids = [];
        switch(typeKey){
            case cc.vv.skinMgr.scissorKey:
                use_id   = cc.vv.userInfo.useScissor;
                have_ids = cc.vv.userInfo.userScissors;
            break;
            case cc.vv.skinMgr.penKey:
                use_id   = cc.vv.userInfo.usePen;
                have_ids = cc.vv.userInfo.userPens;
            break;
            case cc.vv.skinMgr.needleKey:
                use_id   = cc.vv.userInfo.useNeedle;
                have_ids = cc.vv.userInfo.userNeedles;
            break;
        }

        if(use_id<0 || have_ids.length==0){
            this.node.active = false;
            Log.catch('error in shopTipMgr', typeKey,'--',info);
            return false;
        }

        buyBtn.active    = false;
        videoBtn.active  = false;
        signinBtn.active = false;
        useBtn.active    = false;
        usingBtn.active    = false;

        if(info.id == use_id){
            usingBtn.active = true;
        }else if(have_ids.indexOf(info.id)>=0){
            useBtn.active = true;
        }else{
            switch(info.unlock_type){
                case '1':
                    buyBtn.active = true;
                    let gold = buyBtn.getChildByName('number');
                    this.conversionToSprNumber(gold, info.unlock_need);
                break;

                case '2':
                    signinBtn.active = true;
                break;

                case '3':
                    videoBtn.active = true;
                    let number = videoBtn.getChildByName('number');
                    let times  = awardingMgr.getRewardByKey(typeKey, info.id);
                    let str    = times + "/" + info.unlock_need;
                    this.conversionToSprNumber(number, str);
                break;
            }
        }
        return true;
    },

    openSelectView() {
        if (!this.openView) { return }
        this.scissorView.active = this.openView == viewType.scissorTab;
        this.penView.active     = this.openView == viewType.penTab;
        this.needleView.active  = this.openView == viewType.needleTab;
    },

    selectTab(evt){
        if(!evt){return}
        let selectName = evt.target.name;
        if(selectName == this.openView){return}
        this.openView = selectName;
        this.changeTabFrames();
        this.openSelectView();
    },

    selectItem(evt){
        if(!evt){return}
        let selectType = evt.target.type;
        let selectId   = evt.target._id;
        if(!selectId || !selectType){return Log.catch('err in shopTipMgr 228', evt)}
        this.conditionsOfUse(evt.target, selectType, selectId);
    },

    conditionsOfUse(target, selectType, selectId){
        //先找到当前选择得到那个
        let selectedId = '';
        let selectedTypeUserArr = [];
        let selectedItem = null;
        let setEventName = '';
        let buyEventName = '';

        switch (selectType) {
            case cc.vv.skinMgr.scissorKey:
                selectedId = cc.vv.userInfo.useScissor;
                selectedTypeUserArr = cc.vv.userInfo.userScissors;
                this.scissorsArr.forEach(element => {
                    if(element._id == selectedId){
                        selectedItem = element;
                        return
                    }
                });
                setEventName = 'setUserUseScissor';
                buyEventName = 'setUserScissors';
            break;

            case cc.vv.skinMgr.penKey:
                selectedId = cc.vv.userInfo.usePen;
                selectedTypeUserArr = cc.vv.userInfo.userPens;
                this.pensArr.forEach(element => {
                    if(element._id == selectedId){
                        selectedItem = element;
                        return
                    }
                });
                setEventName = 'setUserUsePen';
                buyEventName = 'setUserPens';
            break;
            
            case cc.vv.skinMgr.needleKey:
                selectedId = cc.vv.userInfo.useNeedle;
                selectedTypeUserArr = cc.vv.userInfo.userNeedles;
                this.needlesArr.forEach(element => {
                    if(element._id == selectedId){
                        selectedItem = element;
                        return
                    }
                });
                setEventName = 'setUserUseNeedle';
                buyEventName = 'setUserNeedles';
            break;
        }

        if(selectedId == selectId){
            Log.warn('选择的类型正在使用selectType:',selectType,'selectId:',selectId);
            return;
        }
        
        let selectInfo   = cc.vv.skinMgr.getSkinInfo(selectType, selectId);
        let selectedInfo = cc.vv.skinMgr.getSkinInfo(selectType, selectedId);
        if(selectedTypeUserArr.indexOf(selectId)>=0){
            cc.vv.skinMgr[setEventName](selectId);
        }else{
            //签到解锁
            if(selectInfo.unlock_type == '2'){
                cc.vv.commonTipMgr.show("累计签到才能解锁");
                return;
            }
            //需要金币解锁
            if(selectInfo.unlock_type == '1'){
                let gold   = Number(selectInfo.unlock_need);
                let enough = cc.vv.userMgr.addUserGold(-gold);
                if(enough){
                    cc.vv.skinMgr[setEventName](selectId);
                    cc.vv.skinMgr[buyEventName](selectId);
                    cc.vv.commonTipMgr.show("购买成功");
                    this.updateUserGold();
                }
                else{
                    cc.vv.commonTipMgr.show("金币不足");
                    return;
                }
            }
            //需要视频解锁
            if(selectInfo.unlock_type == '3'){
                this.buySkinByVideo = (type)=>{
                    // if(type != 1){
                    //     this.buySkinByVideo = null;
                    //     return
                    // }
                    let times = Number(selectInfo.unlock_need);
                    let time = awardingMgr.getRewardByKey(selectType, selectId);
                    time += 1;
                    if(time >= times){
                        cc.vv.skinMgr[setEventName](selectId);
                        cc.vv.skinMgr[buyEventName](selectId);
                    }
                    awardingMgr.addRewardTimesByKey(selectType, selectId);
                    this.buySkinByVideo = null;
                }
                this.buySkinByVideo();
            }
        }
        this.initItem(target, selectType, selectInfo);
        this.initItem(selectedItem, selectType, selectedInfo);
    },

    changeTabFrames(){
        this.scissorTab.spriteFrame = this.tabBgFrames[0];
        this.penTab.spriteFrame     = this.tabBgFrames[0];
        this.needleTab.spriteFrame  = this.tabBgFrames[0];
        
        this.scissorSelected.spriteFrame = this.scissorFrames[0];
        this.penSelected.spriteFrame     = this.penFrames[0];
        this.needleSelected.spriteFrame  = this.needleFrames[0];

        switch(this.openView){
            case viewType.scissorTab:
                this.scissorTab.spriteFrame = this.tabBgFrames[1];
                this.scissorSelected.spriteFrame = this.scissorFrames[1];
                break;
            case viewType.penTab:
                this.penTab.spriteFrame = this.tabBgFrames[1];
                this.penSelected.spriteFrame = this.penFrames[1];
                break;
            case viewType.needleTab:
                this.needleTab.spriteFrame = this.tabBgFrames[1];
                this.needleSelected.spriteFrame = this.needleFrames[1];
                break;
        }
    },

    updateUserGold(){
        let gold = cc.vv.userInfo.gold;
        this.goldNumber.removeAllChildren();
        this.conversionToSprNumber(this.goldNumber, gold.toString());
    },

    //target 为一个layout节点
    conversionToSprNumber(target,str){
        if(target && str){
            if(!this.numbersFrames){
                this.numbersFrames = this.numbers.getSpriteFrames();
            }
            target.removeAllChildren();
            for(let i = 0; i < str.length; i++){
                let n = new cc.Node;
                let s = n.addComponent(cc.Sprite);
                if(str[i] == '/'){
                    s.spriteFrame = this.numbersFrames[10];
                }else{
                    s.spriteFrame = this.numbersFrames[Number(str[i])];
                }
                n.parent = target;
            }
        }
    },

    close(){
        this.node.active = false;
    }
});
