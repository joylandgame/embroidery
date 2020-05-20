// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MapComponent from "../embroidery2D/MapComponent"
import mapinfo from "../embroidery2D/mapinfo"
import rollupmgr from "../embroidery2D/rollupmgr"

cc.Class({
    extends: cc.Component,

    properties: {
         
        hintsource:cc.Sprite,     //提示图片
        source:cc.Sprite,         //tx获取的图案 
        btnList:[cc.Button],      //点击列表
        brushpink:cc.Node,      //刺绣笔刷
        brusherase:cc.Node,     //擦除笔刷
        progressbar:cc.ProgressBar,   //针/擦除进度
        layerdraw:cc.Camera,
    },

    ctor() {
        this.map_com = null;
    }, 

    start () {

    },

    init(data) {
        this.game = data.game;
        this.gameID = data.id;
        this.isOver = data.complete;
        if(!this.isOver){
            this.node.on(cc.Node.EventType.TOUCH_START,this.drawBegin,this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE,this.drawMove,this);
            this.node.on(cc.Node.EventType.TOUCH_END,this.drawEnd,this);
        }

        this.initView();
        this.addEvent();
    },

    initView(){

        this.loadMap();
        let texture = new cc.RenderTexture();
        texture.initWithSize(128,128,cc.gfx.RB_FMT_S8);
        this.layerdraw.targetTexture = texture;
    },

    addEvent(){
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    onDestroy(){
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
        this.node.off(cc.Node.EventType.TOUCH_START,this.drawBegin,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.drawMove,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.drawEnd,this);
    },

    game_go_home(){
        let data = this.map_com.getTileLayerData();
        cc.vv.gameMgr.setEmbroideryData(data);
    },
  
    selectColor(e) {
      
        let name = e.currentTarget.getChildByName("Background").getComponent(cc.Sprite).spriteFrame.name;
        
        mapinfo.setCurGid(name)
        if(this.map_com.runstate == 2) {
            this.brusherase.active = false;
            this.brushpink.active = true;
            this.brushpink.position = cc.v2(this.brusherase.position.x,this.brushpink.position.y);
        }

        this.map_com.setRunState(1);
    
    },

    onErase(e) {
        if(this.map_com) {
            if(this.map_com.runstate ==1) {
                this.brusherase.active = true;
                this.brushpink.active = false;
                this.brusherase.position = cc.v2(this.brushpink.position.x,this.brushpink.position.y - 323);
            }
            this.map_com.setRunState(2)
        }
    },

    onDone() {
        if(this.map_com) {
            this.layerdraw.render();
            this.scheduleOnce(()=>{
                this.map_com.doneCixiu(this.layerdraw.targetTexture);
            },1)
            
        }
    },
    onRollup(e){
        this.map_com.rollup();
        ////rollupmgr.rollup();
    },

    loadMap() {
        return new Promise((resolved,reject)=>{
            cc.loader.loadRes("./tilemap/cherry.tmx",(err,map)=>{
                if(err) {
                    console.log("false=========")
                    resolved(false)
                    return;
                } else {
                    
                    this.map_com = this.source.node.addComponent(MapComponent);
                    this.map_com.init(map);
                    let data = cc.vv.gameMgr.getEmbroideryData();
                    this.map_com.setTileLayerModel(data)
                    console.log("mapcom======")
                    let gids =  this.map_com.tile_com.getProperty("usegid");
                    let useicon =  this.map_com.tile_com.getProperty("useicon");
                    
                    
                    mapinfo.parseGid(gids);
                    mapinfo.parseIcons(useicon);

                    let icons_array = useicon.split(";");
                
                    let i=0;
                    
                    for (;i<icons_array.length;i++) {
                        let icon = icons_array[i];
                        let btn = this.btnList[i];
                        if(!btn) {
                            break;
                        }
                    
                        cc.loader.loadRes("./cixiuicon/"+icon, cc.SpriteFrame,(err,res)=>{
                            if(err) {
                                console.error("读取错误",icon)
                            } else {
                              
                                btn.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = res;
                                    
                                btn.node.active = true;
                            }
                        })
                       
                    }
                    for(;i<6;i++) {
                        let btn = this.btnList[i];
                        btn.node.active = false;
                    }

                    let contentsize = this.hintsource.node.getContentSize();
                    let hint_com = this.hintsource.node.addComponent(cc.TiledMap);
                    hint_com.tmxAsset = map;

                    let layer1 = hint_com.node.getChildByName("layer1");
                    let layer2 = hint_com.node.getChildByName("layer2");
                    let layer3 = hint_com.node.getChildByName("layer3");
                
                    layer2.active = false;
                    layer3.active = false;
                    let layer_size = layer1.getContentSize();
                    
                    layer1.setScale(contentsize.width/layer_size.width,contentsize.height/layer_size.height,1);
                    layer2.setScale(contentsize.width/layer_size.width,contentsize.height/layer_size.height,1);
                    layer3.setScale(contentsize.width/layer_size.width,contentsize.height/layer_size.height,1);
                    this.hintsource.node.setContentSize(contentsize.width,contentsize.height);
                    resolved(true);
                }
            })
        })
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
