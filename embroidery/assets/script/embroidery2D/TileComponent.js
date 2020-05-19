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

const default_gid = 14
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
    },
    start () {

    },

    // update (dt) {},

    onLoad() {
        this.tile_com = this.node.addComponent(cc.TiledTile);
    },
    setGrid(x,y) {
        this.tile_com.x = x;
        this.tile_com.y = y;
        
        //if(x ==0 && y==0) {
            ////this.tile_com.gid = 3;
        //}  
        this.tile_com.gid = default_gid; 
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
        return true;
    },
    
    eraseGid(gid) {
        let curgid = this.tile_com.gid
        if(curgid ==default_gid) {    
            return false;
        }
        this.tile_com.gid = default_gid;
        this.tile_com._layer.setTileGIDAt(default_gid,this.tile_com.x,this.tile_com.y);
        console.log("擦除了=========",default_gid,this.tile_com.x,this.tile_com.y);
        this.old_gid = curgid;
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
        this.tile_com.gid = default_gid;
        this.old_gid = 0;
    },
    rollup_erase() {
        console.log("撤销擦除========",this.old_gid);
        if(this.old_gid !=0 && this.old_gid != default_gid) {
            this.tile_com.gid = this.old_gid;
            this.old_gid = 0;
        }
    }
});
