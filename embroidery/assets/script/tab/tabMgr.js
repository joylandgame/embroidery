
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
            this.tailorTab.active = true;
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
        if(this.embroidery){
            this.embroidery.active = true;
            return;
        }
        this.loading.active = true;
        utils.loadPrefab(tabDir + 'embroideryTab', this.node).then((node)=>{
            this.embroidery = node;
            this.embroidery.getComponent('embroideryMgr').init(data);
            this.loading.active = false;
        })
    },

    closeAll(){
        if(this.tailorTab){this.tailorTab.active   = false}
        if(this.drawTab)  {this.drawTab.active     = false}
        if(this.embroidery){this.embroidery.active = false}
    }
})