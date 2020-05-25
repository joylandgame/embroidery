// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const forbit_grid={
    0:{
        0:true,
        1:true,
        2:true,
        3:true,
        4:true,
        5:true,
        6:true,
        13:true,
        14:true,
        15:true,
        16:true,
        17:true,
        18:true,
        19:true,
    },
    1:{
        0:true,
        1:true,
        2:true,
        3:true,
        4:true,
        15:true,
        16:true,
        17:true,
        18:true,
        19:true,
    },
    2:{
        0:true,
        1:true,
        2:true,
        3:true,
        16:true,
        17:true,
        18:true,
        19:true,
    },
    3:{
        0:true,
        1:true,
        2:true,
        17:true,
        18:true,
        19:true,
    },
    4:{
        0:true,
        1:true,
        18:true,
        19:true,
    },
    5:{
        0:true,
        19:true,
    },
    6:{
        0:true,
        19:true,
    },
    13:{
        0:true,
        19:true,
    },
    14:{
        0:true,
        19:true,
    },
    15:{
        0:true,
        1:true,
        18:true,
        19:true,
    },
    16:{
        0:true,
        1:true,
        2:true,
        17:true,
        18:true,
        19:true, 
    },
    17:{
        0:true,
        1:true,
        2:true,
        3:true,
        16:true,
        17:true,
        18:true,
        19:true,
    },
    18:{
        0:true,
        1:true,
        2:true,
        3:true,
        4:true,
        15:true,
        16:true,
        17:true,
        18:true,
        19:true,
    },
    19:{
        0:true,
        1:true,
        2:true,
        3:true,
        4:true,
        5:true,
        6:true,
        13:true,
        14:true,
        15:true,
        16:true,
        17:true,
        18:true,
        19:true,
    },

}

const default_gid =14
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
        this.old_gid = 0;
        this.use_gids = [];
    },
    start () {

    },

    // update (dt) {},

    onLoad() {
        if(!this.tile_com) {
            this.tile_com = this.node.getComponent(cc.TiledTile);
        }
    },
    setGrid(x,y,gid) {
        if(!this.tile_com) {
            if(!this.tile_com) {
                this.tile_com = this.node.getComponent(cc.TiledTile);
            }
        }
        this.tile_com.x = x;
        this.tile_com.y = y;        
        //if(x ==0 && y==0) {
            ////this.tile_com.gid = 3;
        //}
        if(gid!==undefined){
            this.tile_com.gid = gid;
        }else{
            this.tile_com.gid = default_gid;
        }
        this.use_gids.push(this.tile_com.gid);
    },

    onDestroy() {
       
    
    },

    setGid(gid) {
        if(!this.checkCanDraw()) {
            return false;
        }

        if(this.tile_com.gid == gid) {
            return false;
        }

        this.tile_com.gid = gid;
        if(this.use_gids.length > 0 && this.use_gids[this.use_gids.length -1] != gid) {
            this.use_gids.push(gid);  
        }
        return true;
    },
    
    eraseGid(gid) {
        let curgid = this.tile_com.gid
        if(curgid ==default_gid) {    
            return false;
        }
        if(this.use_gids.length > 0 && this.use_gids[this.use_gids.length -1] != curgid) {
            this.use_gids.push(curgid);  
        }
       
        this.tile_com.gid = default_gid;
        this.tile_com._layer.setTileGIDAt(default_gid,this.tile_com.x,this.tile_com.y);
       
        
        return true;
    },

    checkCanDraw() {
        let x = this.tile_com.x;
        let y = this.tile_com.y;
        let forbitx = forbit_grid[x]
        if(forbitx && forbitx[y]) {
            return false;
        }   
        return true;
    },

    //回退绘画
    rollup_pink() {
       
        let revertid = default_gid
        if(this.use_gids.length >= 2) {
            revertid = this.use_gids[this.use_gids.length -2];
            this.use_gids.length = this.use_gids.length -1;
        }

       
        this.tile_com.gid = revertid;
       
    },

    rollup_erase() {
     
       let revertid = default_gid;
       if(this.use_gids.length > 0) {
           revertid = this.use_gids[this.use_gids.length -1];
       }

       this.tile_com.gid = revertid;
    }
});
