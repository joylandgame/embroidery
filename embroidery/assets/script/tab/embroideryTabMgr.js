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

        cutor: cc.Sprite,

        btnLayer: cc.Node,
        btnDone : cc.Node,

        guide: cc.Node,
        handGuide:cc.Node,
        erase:cc.Node,          //笔擦按钮     
        toast:cc.Node,          //提示框
    },

    ctor() {this.map_com = null;}, 

    init(data) {
        this.game = data.game;
        this.gameID = data.id;
        this.isOver = data.complete;
        this.btnDone.active = false;
        this.handGuide.active = false;
        
        mapinfo.init();//初始化画笔
        
        this.initView();
        this.addEvent();
    },

    addEvent(){
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);
        
        this.node.on(cc.Node.EventType.TOUCH_START,this.drawBegin,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.drawMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.drawEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.drawCancel,this);
        this.erase.on(cc.Node.EventType.TOUCH_START,this.showEraseTip,this);
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
        this.initCutorSkin();
        let texture = new cc.RenderTexture();
        texture.initWithSize(640,640,cc.gfx.RB_FMT_S8);
        this.layerdraw.targetTexture = texture;

        this.showGuide(1);
    },

    showDemo(){
        if(!cc.vv.tiledMapDemo){
            Log.catch('err in embroideryMgr 87, cc.vv.tiledMapDemo::',cc.vv.tiledMapDemo);
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
            Log.catch('err in embroideryMgr 113, cc.vv.tiledMapDemo::',cc.vv.tiledMapDemo);
            return;
        }
        this.map_com = this.source.addComponent(MapComponent);
        this.map_com.init(cc.vv.tiledMapDemo);
        let data     = cc.vv.gameMgr.getEmbroideryData();
        this.map_com.setTileLayerModel(data);
    },

    setUtilsView(){
        // if(!this.isOver){
            this.btnLayer.active = true;
            this.initLineList();
        // }else{
        //     this.btnLayer.active   = false;
        //     this.linesLayer.active = false;
        // }
    },

    initCutorSkin(){
        if(cc.vv.skinMgr.try_UseNeedleInfo){
            let info = cc.vv.skinMgr.try_UseNeedleInfo;
            this.cutor.spriteFrame = cc.vv.needlesSkin[info.skin_try_icon];
        }else{
            let info = cc.vv.skinMgr.useNeedleInfo;
            this.cutor.spriteFrame = cc.vv.needlesSkin[info.skin_try_icon];
        }
    },

    initLineList(){
        if(this.lineArr && this.lineArr.length){return}
        if(!cc.vv.linesAsset){
            Log.catch('err in embroideryMgr 135, cc.vv.linesAsset::',cc.vv.linesAsset);
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
      
        /*
        let sp = this.selectLine.getComponent(cc.Sprite);
        let mat = sp.getMaterial(0)
        console.log("mat=========xxxx",mat.getProperty("a_color"),mat.getProperty("color"));
        mat.setProperty("a_color",cc.color(255,255,255,255));
        */
    },

    takeUpLine(){
        if(this.selectLine){
            this.selectLine.y = 10;
            this.selectLine.setScale(cc.v2(1.5,1.5));
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
                this.brusherase.position = cc.v2(this.brushpink.position.x,this.brushpink.position.y - 363);
            }
            this.layDownLine();
            this.map_com.setRunState(2)
        }
    
    },

    onDone() {
        // if(this.map_com) {
            // this.isOver = true;
            // this.setUtilsView();
            cc.vv.userMgr.setUserGudie('5');
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
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.drawCancel,this)
        this.erase.off(cc.Node.EventType.TOUCH_START,this.showEraseTip,this);
    },

    drawBegin(e) {
        if(this.map_com) {
            this.map_com.drawBegin(e)
        }
        this.hideGuide();
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
        cc.vv.audioMgr.stopEffect('stitch');
    },
    drawCancel(e){
        if(this.map_com) {
            this.map_com.drawEnd(e)
        }
        cc.vv.audioMgr.stopEffect('stitch');
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

    showGuide(index){
        if(cc.vv.userInfo.guide && cc.vv.userInfo.guide['2']){
            return;
        }
        if(index == 1){
            this.guide.active = true;
        }
    },

    hideGuide(){
        this.guide.active = false;
        cc.vv.userMgr.setUserGudie('2');
    },
    checkHandGuide() {
        this.btnDone.active = true;
        if(cc.vv.userInfo.guide && cc.vv.userInfo.guide['5']) {
            return 
        } else {
            this.handGuide.active = true;  
        }
    },

    showEraseTip() {
        this.toast.active = true;
        
    },

    toastOK() {
        this.onErase();
        this.toastClose();
    },

    toastClose() {
        this.toast.active = false;
    }
});
