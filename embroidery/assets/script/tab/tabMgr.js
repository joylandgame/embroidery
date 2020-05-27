
import Log from '../common/Log';
import utils from '../common/utils';
import skinTryMgr from '../userInfo/skinTry';

const tabDir = 'featuresPrefab/';

const tailorTabID        = '0';
const drawTabID          = '1';
const embroideryTabID    = '2';
const putEmbroideryTabID = '3';

cc.Class({
    extends: cc.Component,
    properties: {
        loading: cc.Node,
        tailorTabLayer: cc.Prefab
    },

    init(game){
        this.game = game;
        this.gameMgr = cc.vv.gameMgr;
        this.openedID = '';
        this.openID  = '';
        this.loading.active = false;

        this.tailorTab = null;
        this.drawTab   = null;
        this.embroideryTab = null;
        this.putClothesTab = null;
    },

    //在加载弹框前去展示试用皮肤
    showTrySkinTip(id){
        this.openID = id;
        if(id == tailorTabID){
            let info = skinTryMgr.getTrySkinInfo();
            if(info){
                this.openTrySkinTip(info, this.openTab.bind(this));
                return;
            }
        }
        this.openTab();
    },

    openTab(){
        let id  = this.openID;
        if(id === this.openedID){return}
        this.closeAll();
        switch(id){
            case tailorTabID:
                this.openTailorTab({
                    game: this.game,
                    id  : this.gameMgr.tailorID,
                    complete: this.gameMgr.getAnyOneIsComplete(this.gameMgr.tailorID)
                })
                break;

            case drawTabID:
                this.openDrawTab({
                    game: this.game,
                    id  : this.gameMgr.drawID,
                    complete: this.gameMgr.getAnyOneIsComplete(this.gameMgr.drawID)
                })
                break;

            case embroideryTabID:
                this.openEmbroideryTab({
                    game: this.game,
                    id  : this.gameMgr.embroideryID,
                    complete: this.gameMgr.getAnyOneIsComplete(this.gameMgr.embroideryID)
                })
                break;
            case putEmbroideryTabID:
                this.openPutClothesTab({
                    game: this.game,
                    id  : this.gameMgr.putEmbroideryTabID,
                    complete: this.gameMgr.getAnyOneIsComplete(this.gameMgr.putEmbroideryTabID)
                })
        }

        this.openedID = id;
    },

    //加载 裁剪
    openTailorTab(data){
        if(this.tailorTab){
            this.tailorTab.active = true;
            return;
        }
        // this.loading.active = true;
        // utils.loadPrefab(tabDir + 'tailorTab', this.node).then((node)=>{
        //     this.tailorTab = node;
        //     this.tailorTab.getComponent('tailorTabMgr').init(data);
        //     this.loading.active = false;
        // })
        this.tailorTab = cc.instantiate(this.tailorTabLayer);
        this.tailorTab.parent = this.node;
        this.tailorTab.getComponent('tailorTabMgr').init(data);
    },

    //加载 上色
    openDrawTab(data){
        if(this.drawTab){
            this.drawTab.active = true;
            return;
        }
        this.loading.active = true;
        utils.loadPrefab(tabDir + 'drawTab', this.node).then((node)=>{
            this.drawTab = node;
            this.drawTab.getComponent('drawTabMgr').init(data);
            this.loading.active = false;
        })
    },

    //加载 刺绣
    openEmbroideryTab(data){
        if(this.embroideryTab){
            this.embroideryTab.active = true;
            return;
        }
        this.loading.active = true;
        utils.loadPrefab(tabDir + 'embroideryTab', this.node).then((node)=>{
            this.embroideryTab = node;
            this.embroideryTab.getComponent('embroideryTabMgr').init(data);
            this.loading.active = false;
        })
    },

    openPutClothesTab(data){
        if(this.putClothesTab){
            this.putClothesTab.getComponent('putClothesTabMgr').init(data);
            this.putClothesTab.active = true;
            return;
        }
        this.loading.active = true;
        utils.loadPrefab(tabDir + 'putClothesTab', this.node).then((node)=>{
            this.putClothesTab = node;
            this.putClothesTab.getComponent('putClothesTabMgr').init(data);
            this.loading.active = false;
        })
    },

    openTrySkinTip(data, call){
        if(this.trySkinTip){
            this.trySkinTip.getComponent('tryTipMgr').init(data, call);
            return;
        }
        this.loading.active = true;
        utils.loadPrefab('./tipViewPrefab/trySkinTip', this.node).then((node)=>{
            this.trySkinTip = node;
            this.trySkinTip.getComponent('tryTipMgr').init(data, call);
            this.loading.active = false;
        })
    },

    clearAllTab(){

        if(this.tailorTab){
            this.tailorTab.destroy();
            this.tailorTab = null;
        }
        if(this.drawTab){
            this.drawTab.destroy();
            this.drawTab = null;
        }
        if(this.embroideryTab){
            this.embroideryTab.destroy();
            this.embroideryTab = null;
        }
        if(this.putClothesTab){
            this.putClothesTab.destroy();
            this.putClothesTab = null;
        }
        
    },

    closeAll(){
        if(this.tailorTab){this.tailorTab.active = false}
        if(this.drawTab)  {
            this.drawTab.getComponent('drawTabMgr').setResultData();
            this.drawTab.active = false
        }
        if(this.embroideryTab){
            this.embroideryTab.getComponent('embroideryTabMgr').setResultData();
            this.embroideryTab.active = false
        }
        if(this.putClothesTab){this.putClothesTab.active = false}
        cc.vv.audioMgr.stopAllEffect();
    }
})