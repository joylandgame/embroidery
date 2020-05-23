// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MapComponent from "../embroidery2D/MapComponent"
import mapinfo from "../embroidery2D/mapinfo"
import rollupmgr from "../embroidery2D/rollupmgr"
import Log from "../common/Log";

cc.Class({
    extends: cc.Component,

    properties: {
        
        demoTip: cc.Node,

        hintsource:cc.TiledMap,     //提示图片
        source:cc.Node,         //tx获取的图案 
        brushpink:cc.Node,      //刺绣笔刷
        brusherase:cc.Node,     //擦除笔刷
        progressbar:cc.ProgressBar,   //针/擦除进度
        layerdraw:cc.Camera,

        linesLayer: cc.Node,
        lineItem: cc.Node, //线轴

        btnLayer: cc.Node,
        btnDone : cc.Node,
    },

    ctor() {this.map_com = null;}, 

    init(data) {
        this.game = data.game;
        this.gameID = data.id;
        this.isOver = data.complete;

        mapinfo.init();//初始化画笔

        if(!this.isOver){
            this.node.on(cc.Node.EventType.TOUCH_START,this.drawBegin,this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE,this.drawMove,this);
            this.node.on(cc.Node.EventType.TOUCH_END,this.drawEnd,this);
        }
        this.initView();
        this.addEvent();
    },

    addEvent(){
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    game_go_home(){
        let data = this.map_com.getTileLayerData();
        cc.vv.gameMgr.setEmbroideryData(data);
    },

    clear(){
        if(this.lineArr && this.lineArr.length){
            this.lineArr.forEach(item => {
                item.parent = null;
                item.destroy();
            })
        }
        this.selectLine = null; //当前选中的线
        this.loadReady  = false;
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    initView(){
        this.showDemoWhite();
        this.showDemo();
        this.setUtilsView();
        let texture = new cc.RenderTexture();
        texture.initWithSize(640,640,cc.gfx.RB_FMT_S8);
        this.layerdraw.targetTexture = texture;
    },

    showDemo(){
        if(!cc.vv.tiledMapDemo){
            Log.catch('err in embroideryMgr 71, cc.vv.tiledMapDemo::',cc.vv.tiledMapDemo);
            return;
        }
        let contentsize = this.hintsource.node.getContentSize();
        let hint_com = this.hintsource;
        hint_com.tmxAsset = cc.vv.tiledMapDemo;
        let layer1 = hint_com.node.getChildByName("layer1");
        let layer2 = hint_com.node.getChildByName("layer2");
        let layer3 = hint_com.node.getChildByName("layer3");
        layer2.active = false;
        layer3.active = false;
        let layer_size = layer1.getContentSize();
        layer1.setScale(contentsize.width/layer_size.width,contentsize.height/layer_size.height,1);
        this.hintsource.node.setContentSize(contentsize.width,contentsize.height);
        
        this.scheduleOnce(()=>{
            this.demoTip.y = cc.winSize.height / 2;
            let offset     = this.demoTip.y - this.demoTip.height + 60
            this.demoTip.runAction(
                cc.moveTo(0.5,this.demoTip.x,offset).easing(cc.easeBackOut())
            )
        },0.018)
    },

    showDemoWhite(){
        if(!cc.vv.tiledMapDemo){
            Log.catch('err in embroideryMgr 98, cc.vv.tiledMapDemo::',cc.vv.tiledMapDemo);
            return;
        }
        this.map_com = this.source.addComponent(MapComponent);
        this.map_com.init(cc.vv.tiledMapDemo);
        let data     = cc.vv.gameMgr.getEmbroideryData();
        this.map_com.setTileLayerModel(data);
    },

    setUtilsView(){
        if(!this.isOver){
            this.btnLayer.active = true;
            this.initLineList();
        }else{
            this.btnLayer.active   = false;
            this.linesLayer.active = false;
        }
    },

    initLineList(){
        if(this.lineArr && this.lineArr.length){return}
        if(!cc.vv.linesAsset){
            Log.catch('err in embroideryMgr 123, cc.vv.linesAsset::',cc.vv.linesAsset);
            return;
        }
        this.lineArr = [];
        let gids    =  this.map_com.tile_com.getProperty("usegid");
        let icon_arr = gids.split(';');
        for(let i = 0; i < icon_arr.length; i++){
            let item = cc.instantiate(this.lineItem);
            let key  = icon_arr[i];
            item.getComponent(cc.Sprite).spriteFrame = cc.vv.linesAsset[key];
            item.gid = icon_arr[i];
            item.id  = i.toString();
            item.parent = this.linesLayer;
            item.active = true;
            this.lineArr.push(item);
        }
        this.selectColor({target: this.lineArr[0]})
    },

    selectColor(evt) {
        if(this.selectLine){
            if (evt.target.id == this.selectLine.id) {
                return;
            }
            this.layDownLine();
        }
        this.selectLine = evt.target;
        let gid = this.selectLine.gid;
        mapinfo.setGid(gid);
        if(this.map_com.runstate == 2) {
            this.brusherase.active = false;
            this.brushpink.active  = true;
            this.brushpink.position = cc.v2(this.brusherase.position.x,this.brushpink.position.y);
        }
        this.map_com.setRunState(1);
        this.takeUpLine();
    },

    takeUpLine(){
        if(this.selectLine){
            this.selectLine.y = 10;
            this.selectLine.setScale(cc.v2(1.1,1.1));
        }
    },

    layDownLine(){
        if(this.selectLine){
            this.selectLine.y = 0;
            this.selectLine.setScale(cc.v2(1,1));
            this.selectLine = null;
        }
    },

    onErase(e) {
        if(this.map_com) {
            if(this.map_com.runstate ==1) {
                this.brusherase.active = true;
                this.brushpink.active = false;
                this.brusherase.position = cc.v2(this.brushpink.position.x,this.brushpink.position.y - 323);
            }
            this.layDownLine();
            this.map_com.setRunState(2)
        }
    },

    onDone() {
        // if(this.map_com) {
            // this.isOver = true;
            // this.setUtilsView();
            cc.vv.eventMgr.emit(cc.vv.eventName.complete_one_game,this.gameID);
        // }
    },

    setResultData(){
        this.layerdraw.render();
        let renderTexture = this.layerdraw.targetTexture;
        let data  = renderTexture.readPixels();
        let img = new cc.Texture2D();
        img.initWithData(data, 16, 640, 640);
        let frame = new cc.SpriteFrame(img);
        frame.setFlipY(true);
        let score = this.map_com.calcScore();
        cc.vv.gameMgr.setPerformEmbroideryData({
            score: score,
            frame: frame,
        })
    },

    onRollup(e){
        this.map_com.rollup();
    },

    onDestroy(){
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
        this.node.off(cc.Node.EventType.TOUCH_START,this.drawBegin,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.drawMove,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.drawEnd,this);
    },

    drawBegin(e) {
        console.log("drawBegin===",this.map_com)
        if(this.map_com) {
            this.map_com.drawBegin(e)
        }
    },
    drawMove(e) {
        if(this.map_com) {
            this.map_com.drawMove(e)
        }
    },
    drawEnd(e) {
        if(this.map_com) {
            this.map_com.drawEnd(e)
        }
    },
    drawNumOne(e) {
        if(this.map_com) {
            this.map_com.drawNumOne()
        }
    },
    drawNumFour(e) {
        if(this.map_com) {
            this.map_com.drawNumFour()
        }
    },
});
