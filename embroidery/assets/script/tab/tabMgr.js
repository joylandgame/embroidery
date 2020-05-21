
import Log from '../common/Log';
import utils from '../common/utils';

const tabDir = 'featuresPrefab/';

const tailorTabID        = '0';
const drawTabID          = '1';
const embroideryTabID    = '2';
const putEmbroideryTabID = '3';

cc.Class({
    extends: cc.Component,
    properties: {
        loading: cc.Node,
    },

    init(game){
        this.game = game;
        this.gameMgr = cc.vv.gameMgr;
        this.openID = '';
        this.loading.active = false;

        this.tailorTab = null;
        this.drawTab   = null;
        this.embroidery    = null;
        this.putClothesTab = null;
    },

    openTab(id){
        if(id === this.openID){return}
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
        }

        this.openID = id;
    },

    //加载 裁剪
    openTailorTab(data){
        if(this.tailorTab){
            this.tailorTab.getComponent('tailorTabMgr').init(data);
            return;
        }
        this.loading.active = true;
        utils.loadPrefab(tabDir + 'tailorTab', this.node).then((node)=>{
            this.tailorTab = node;
            this.tailorTab.getComponent('tailorTabMgr').init(data);
            this.loading.active = false;
        })
    },

    //加载 上色
    openDrawTab(data){
        if(this.drawTab){
            this.drawTab.getComponent('drawTabMgr').init(data);
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
            this.embroideryTab.getComponent('embroideryTabMgr').init(data);
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
            return;
        }
        this.loading.active = true;
        utils.loadPrefab(tabDir + 'putClothesTab', this.node).then((node)=>{
            this.putClothesTab = node;
            this.putClothesTab.getComponent('putClothesTabMgr').init(data);
            this.loading.active = false;
        })
    },

    //重新初始化 不去重新加载了
    clearAllTab(){
        if(this.tailorTab){
            let tailorTabMgr = this.tailorTab.getComponent('tailorTabMgr');
            tailorTabMgr.clear();
        }
        if(this.drawTab){
            let drawTabMgr = this.drawTab.getComponent('drawTabMgr');
            drawTabMgr.clear();
        }
        if(this.embroidery){
            let embroideryTabMgr = this.embroideryTab.getComponent('embroideryTabMgr');
            embroideryTabMgr.clear();
        }
        if(this.putClothesTab){
            let putClothesTabMgr = this.putClothesTab.getComponent('putClothesTabMgr');
            putClothesTabMgr.clear();
        }
    },

    closeAll(){
        if(this.tailorTab){this.tailorTab.active   = false}
        if(this.drawTab)  {this.drawTab.active     = false}
        if(this.embroidery){this.embroidery.active = false}
    }
})