
var color_table = [
    null,
    cc.color(218,123,86,255),
    cc.color(219,205,208,255),
    cc.color(106,75,233,255),
    cc.color(233,75,195,255),
    cc.color(75,201,233,255),
    cc.color(8,192,118,255),
    cc.color(71,141,113,255),
    cc.color(237,241,131,255),
    cc.color(170,131,73,255),
    cc.color(126,82,41,255),
    cc.color(61,55,50,255),
    cc.color(236,180,234,255),
    cc.color(230,63,84,255)
]
   
var mapinfo = {
    
    init() {
        this.gid = 0;
        return this;
    },

    setGid(gid) {
        this.gid = Number(gid);
    },
    
    getGid() {
        let color = null;
        if(this.gid < color_table.length) {
            color = color_table[this.gid];
        }
        if(!color){
            return null;
        }
        return {
            gid: this.gid,
            color: color,
        }
    },
 
}

export default mapinfo;