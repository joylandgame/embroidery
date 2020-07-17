// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TileComponent from "./TileComponent";
import mapinfo from "./mapinfo";
import rollupmgr from "./rollupmgr"
import utils from "./embroideryUtils";
import Log from "../common/Log";

const scale = 0.8875
const world_position = new cc.Vec2();
const righdown_position = new cc.Vec2();
const leftup_position = new cc.Vec2();
const pinkheaderworld = new cc.Vec2();
const eraseworld = new cc.Vec2();
const gridsize = scale * 32;
const pink_y_diff = -323
const movespd = 200
///runstate:1 刺绣状态 2:擦除状态
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    ctor() {
        this.tile_com = null;
        this.move_pos = null;
        this.layer_draw = null;
        this.state = 0;
        this.runstate = 1;      //刺绣状态
        this.pinkanicounter = 0;
        this.action_slot = null;
        this._select_num = 1
    },

    tile_com:cc.TileMap,

    pinknode:cc.Node,   //针和线
    pinkheader:cc.Node, //针

    erasenode:cc.Node,  //擦柱
    start_pos:cc.Vec2,   //开始坐标
    layer_draw:cc.TiledLayer, // 绘制层
    progressnode:cc.Node,     //进度条
    last_ani_time:Number,     //上次针播放动作时间
    action_slot:cc.Action,
    linenode:cc.Node,        //当前线的节点
    pinkpartile:cc.ParticleSystem,     //针的动画
    eraseparticle:cc.ParticleSystem,   //笔擦的动画
    render_texture_node:cc.Node,       //渲染到纹理的节点

    rendertexture:cc.Sprite,          //渲染结果的节点

    _select_num:Number,               //选择个数
    start () {

    },

    // update (dt) {},

    onLoad() {
        this.tile_com = this.node.addComponent(cc.TiledMap);
        this._select_num = 1;
    },

    onDestroy() {
    
    },
    
    update(dt){
        if(this.move_pos) {
            let dir = cc.v2(this.move_pos.x - this.start_pos.x,this.move_pos.y - this.start_pos.y);
                
            let length = 1/Math.sqrt(dir.x * dir.x + dir.y * dir.y);
            let dir_norm = cc.v2(dir.x * length,dir.y * length)

            if(this.runstate ==1) {
               
                this.pinkheader.getWorldPosition(pinkheaderworld);
                let dist_position = cc.v2(pinkheaderworld.x + dir_norm.x * dt * movespd,pinkheaderworld.y + dir_norm.y * dt * movespd);
                if(this.checkCanMove(dist_position)){
                    this.pinknode.position = cc.v2(this.pinknode.position.x + dir_norm.x * dt * movespd,this.pinknode.position.y + dir_norm.y * dt * movespd);;
                    if(this.progressnode.active) {
                        this.progressnode.position = cc.v2(this.pinknode.position.x,this.pinknode.position.y + pink_y_diff);
                    }
                } 
            
                
            } else {
                this.erasenode.getWorldPosition(eraseworld);
                let dist_position = cc.v2(eraseworld.x + dir_norm.x * dt * movespd,eraseworld.y + dir_norm.y * dt * movespd);
                if(this.checkCanMove(dist_position)){
                    this.erasenode.position = cc.v2(this.erasenode.position.x + dir_norm.x * dt * movespd,this.erasenode.position.y + dir_norm.y * dt * movespd);;
                    if(this.progressnode.active) {
                        this.progressnode.position = this.erasenode.position;
                    }
                } 
            }

            this.start_pos = this.move_pos;
       } 

       if(this.state == 2) {
           if(this.runstate ==1) {
                /*
                if(this.pinkanicounter ==0) {
                    this.pinknode.y = this.pinknode.y - scale * 28;
                    this.pinkanicounter = 1;
                } else {
                    this.pinknode.y = this.pinknode.y + scale * 28;
                    this.pinkanicounter = 0;
                }
                */
                this.pinkheader.getWorldPosition(pinkheaderworld);
                if(this.checkPinkGrid(pinkheaderworld)) {
                    this.layer_draw._prepareToRender();
                }
                
           } else if(this.runstate ==2) {
                this.erasenode.getWorldPosition(eraseworld);
                if(this.checkEraseGrid(eraseworld)) {
                    this.layer_draw._prepareToRender();
                }
                this.playEraseParticle();
           }
       }
    },  

    
    init(tileaset) {
        this.allNumber = 0;
        Log.d("group===========",cc.game.groupList)
        this.tile_com.tmxAsset = tileaset;
        let render_texture_node = this.tile_com.getLayer("layer2");
        render_texture_node.node.group = "layerdraw";

        /////this.render_texture_node = render_texture_node.node.addComponent(cc.Sprite);    
        /*
        this.rendertexture = this.node.parent.getChildByName("rendertexture").getComponent(cc.Sprite);
        this.rendertexture.setMaterial(0,rendtexture);
        */
        ////this.rendertexture.spriteFrame.setTexture();


        this.pinknode = this.node.parent.getChildByName("brush_pink");
        this.pinkheader = this.pinknode.getChildByName("pinkpoint");
        this.erasenode = this.node.parent.getChildByName("brush_erase");
        this.progressnode = this.node.parent.getChildByName("progressbar");
        this.linenode  = this.pinknode.getChildByName("line");
        this.pinkpartile = this.node.parent.getChildByName("particle_pink").getComponent(cc.ParticleSystem);
        this.eraseparticle = this.node.parent.getChildByName("partcile_erase").getComponent(cc.ParticleSystem);
        let contentsize = this.node.getContentSize();
        let layer1 = this.node.getChildByName("layer1");
        let layer2 = this.node.getChildByName("layer2");
        let layer3 = this.node.getChildByName("layer3");
        let layer_size = layer1.getContentSize();
        this.setUtils();
        
        layer1.active = false;
        layer1.setScale(contentsize.width/layer_size.width * scale,contentsize.height/layer_size.height * scale,1);
        layer2.setScale(contentsize.width/layer_size.width * scale,contentsize.height/layer_size.height * scale,1);
        layer3.setScale(contentsize.width/layer_size.width * scale,contentsize.height/layer_size.height * scale,1);
        
        this.node.setContentSize(contentsize.width,contentsize.height);
        this.node.getWorldPosition(world_position);

        righdown_position.x = world_position.x - contentsize.width * 0.5 * scale;
        righdown_position.y = world_position.y - contentsize.height  * 0.5 * scale;
        leftup_position.x = world_position.x + contentsize.width  * 0.5 * scale;
        leftup_position.y = world_position.y + contentsize.height * 0.5 * scale;
    },

    setTileLayerModel(data){
        this.layer_draw = this.tile_com.getLayer("layer2");
        let layersize = this.layer_draw.getLayerSize();
        if(data && data.length){
            for (let i=0;i<layersize.width;i++) {
                for (let j=0;j<layersize.height;j++) {
                    let tile = this.layer_draw.getTiledTileAt(i,j,true)
                    if(tile) {
                        let tile_com =tile.addComponent(TileComponent);
                        tile_com.setGrid(i,j,data[j*layersize.width+i]);
                    }
                }
            }
            this.layer_draw._prepareToRender();
        }else{
            for (let i=0;i<layersize.width;i++) {
                for (let j=0;j<layersize.height;j++) {
                    let tile = this.layer_draw.getTiledTileAt(i,j,true)
                    if(tile) {
                        let tile_com =tile.addComponent(TileComponent);
                        tile_com.setGrid(i,j);
                    }
                }
            }
        }
       //this.layer_draw._prepareToRender();
    },

    drawBegin(e) {
        if(this.state !=0 ) {
            Log.d("this.state=========",this.state)
            return;
        }
        this.state = 1;
        
        this.start_pos = e.touch.getLocation();
        if(this.runstate == 1){
            cc.vv.audioMgr.playEffect('stitch');
        }
        this.progress().then((res)=>{
            if(!res) {
                return;
            }
            if(this.state !=1) {
                return;
            }
            this.state = 2;
            if(this.runstate ==1) {
                let partile = this.node.parent.getChildByName("particle_pink").getComponent(cc.ParticleSystem);
                partile.resetSystem();
                let seq = cc.sequence(
                    cc.callFunc(()=>{
                        //向上
                        this.pinknode.position = cc.v2(this.pinknode.x,this.pinknode.y + scale * 5);
                    },this),
                    cc.delayTime(0.1),
                    cc.callFunc(()=>{
                        this.pinknode.position = cc.v2(this.pinknode.x,this.pinknode.y - scale * 5);
                        this.playPinkParticle();
                   }),
                   cc.delayTime(0.1),
                   cc.callFunc(()=>{
                       if(this.state !=2) {
                           if(this.action_slot) {
                               this.pinknode.stopAction(this.action_slot);
                               this.action_slot = null;
                           } else {
                                seq.stop();
                                Log.d("强制停止")
                                seq._actions = [];  
                           }
                       }
                   })
                )

                this.action_slot = this.pinknode.runAction(cc.repeatForever(seq))
            }
        })
    },

    drawMove(e) {
        let cur = e.touch.getLocation(); 
        this.move_pos = cur;
    },

    drawEnd(e) {
        if(this.state == 1) {

        }
        this.state = 0;
        this.move_pos = null;
        rollupmgr.clearCurAction();
        if(this.action_slot) {
            this.pinknode.stopAction(this.action_slot);
            this.action_slot = null;
        }
    },

    progress() {
        return new Promise((resolved,rejected)=>{
            this.progressnode.active = true;
            let procom = this.progressnode.getComponent(cc.ProgressBar);
            procom.progress = 0;
            if(this.runstate == 1) {
                this.progressnode.position = cc.v2(this.pinknode.position.x,this.pinknode.y + pink_y_diff);
            } else if(this.runstate ==2) {
                this.progressnode.position = cc.v2(this.erasenode.position.x,this.erasenode.position.y);
            }
            let slot = setInterval(()=>{
                if(this.state !=1) {
                    this.progressnode.active = false;
                    clearInterval(slot);
                    resolved(false);
                }
                procom.progress = procom.progress + 0.05;
                if(procom.progress >= 1) {
                    if (this.runstate ==1) {
                        this.progressnode.active = false;
                    }

                    clearInterval(slot);
                    if(this.state !=1) {
                        Log.d("resolve state not one====")
                        resolved(false)
                        return;
                    }
                    resolved(true)
                }
            },30)
        })
       
    },

    rollup() {
        if(rollupmgr.rollup()) {
            this.layer_draw._prepareToRender();
        }
    },

    checkPinkGrid(worlddist) {
        let layersize = this.layer_draw.getLayerSize();

        // let modx = worlddist.x % gridsize;
        ///可以判断距离，不要太灵敏
        let change = false;
        let grid_x = Math.floor((worlddist.x - righdown_position.x)/gridsize);
        let grid_y = layersize.height - Math.floor((worlddist.y - righdown_position.y)/gridsize) -1;
        if(grid_x >= layersize.height || grid_x >= layersize.width || grid_x <0 || grid_y < 0) {
        
            return change;
        }
      
        for (let i=0;i<this._select_num;i++) {
            let gridx = grid_x - i % 2;
            let gridy = grid_y - Math.floor(i / 2);

            let tiled = this.layer_draw.getTiledTileAt(gridx,gridy);
            if(tiled) {
                let tile_com = tiled.node.getComponent(TileComponent);
                if(!tile_com) {
                    tile_com = tiled.node.addComponent(TileComponent);
                    tile_com.setGrid(gridx,gridy);
                   
                }
                let info = mapinfo.getGid();
                if(info){
                    let gid = info.gid;
                    if(tile_com.setGid(gid)) {
                        change = true;
                        rollupmgr.addPinkAction(tile_com)
                    }
                   
                }
            }
        } 
        
        let score = this.calcScore();
        if(score >= 80) {
            let embroid = this.node.parent.getComponent("embroideryTabMgr");
            embroid.checkHandGuide();
        }
        return change;  
    },
    checkEraseGrid(worlddist) {
        let layersize = this.layer_draw.getLayerSize();
        let change = false;
        let modx = worlddist.x % gridsize;
        ///可以判断距离，不要太灵敏
        
        let grid_x = Math.floor((worlddist.x - righdown_position.x)/gridsize);
        let grid_y = layersize.height - Math.floor((worlddist.y - righdown_position.y)/gridsize) -1;
       
        if(grid_x >= layersize.height || grid_x >= layersize.width || grid_x <0 || grid_y < 0) {
            
            return change;
        }

        for (let i=0;i<this._select_num;i++) {
            let gridx = grid_x - i % 2;
            let gridy = grid_y - Math.floor(i / 2);

            let tiled = this.layer_draw.getTiledTileAt(gridx,gridy);
            if(tiled) {
                let tile_com = tiled.node.getComponent(TileComponent);
                if(tile_com.eraseGid()) {
                    rollupmgr.addEraseAction(tile_com)
                    
                    change = true;
                }
            }
        }
        return this.change;
    },

    checkCanMove(worlddist) {
    
        if(worlddist.x >= righdown_position.x && worlddist.x <= leftup_position.x && worlddist.y >= righdown_position.y && worlddist.y <= leftup_position.y) {
            return true;
        }
        
        return false;
    },

    setRunState(runstate) {
        this.runstate = runstate;
        if(this.runstate ==1) {
            this.setUtils();

            this.progressnode.active = false;
        }
    },

    setUtils(){
        let info = mapinfo.getGid();
        if(info){
            let linecolor = info.color;
            this.linenode.active = true;
            this.pinkpartile.startColor = linecolor;
            this.pinkpartile.endColor = linecolor;
            let line = this.linenode.getComponent(cc.Sprite);
            let mat = line.getMaterial(0);
            console.log("line mat===",mat)
            mat.setProperty("defalutcolor",linecolor);
        }else{
            this.linenode.active = false;
            this.pinkpartile.startColor = cc.color(0,0,0,0);
            this.pinkpartile.endColor = cc.color(0,0,0,0);
        }
        this.pinkpartile.endColorVar = cc.color(0,0,0,0);
        this.pinkpartile.startColorVar = cc.color(0,0,0,0);
        this.pinkpartile.srcBlendFactor = cc.macro.SRC_COLOR;
    },

    playPinkParticle() {
        let node = this.pinkpartile.node
        node.position = cc.v2(this.pinknode.position.x,this.pinknode.y + pink_y_diff);
        if(!this.pinkpartile.active) {
            this.pinkpartile.resetSystem();
        }
    },
    playEraseParticle() {
        if(!this.erasenode.active) {
           
            return;
        }
        this.eraseparticle.node.position = this.erasenode.position;

        //if(!this.eraseparticle.active) {
            Log.d("reset system")
            this.eraseparticle.node.active = true;
            this.eraseparticle.resetSystem();
          
        /// }
    },

    //计算分数
    calcScore() {
        let layertemplate = this.tile_com.getLayer("layer1");
        let drawData      = this.layer_draw._tiles;
        let demoData      = layertemplate._tiles;
        ////let allNumber     = demoData.length;
      
        if(this.allNumber == 0) {
            let allNumber = 0;

            for (let i=0;i<demoData.length;i++) {
                let draw = demoData[i];
                if(draw !=0) {
                    allNumber++;
                }
            }
            this.allNumber = allNumber;
        }
       
        let rightNumber   = 0;
        for(let index = 0; index < demoData.length; index++){
            let draw = drawData[index];
            let demo = demoData[index];
            if (demo !=0) {
                if (demo == draw) {
                    rightNumber++;
                }
            } else {
                if (demo != draw && draw != 14) {
                    rightNumber--;
                }
            }
            /*
            if(demo != 0 && demo == draw){
                rightNumber++;
            }
            
            if(demo == 0 && demo != draw){
                rightNumber--;
            }
            */
        }
        rightNumber = rightNumber < 0 ? 0 : rightNumber;
        if(this.allNumber == 0) {
            this.allNumber = demoData.length;
        }
        
        return Math.ceil(rightNumber / this.allNumber * 100);
    },

    /******************************tab Control*********************************/
    getTileLayerData(){
        if(this.layer_draw && this.layer_draw._tiles){
            return this.layer_draw._tiles;
        }
    },
    drawNumOne() {
        this._select_num = 1
    },
    drawNumFour() {
        this._select_num = 4
    }
});
