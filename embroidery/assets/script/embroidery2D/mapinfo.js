const one_color = cc.color(218,123,86,255);
const two_color = cc.color(219,205,208,255);
const three_color = cc.color(106,75,233,255);
const four_color = cc.color(233,75,195,255);
const five_color = cc.color(75,201,233,255);
const six_color = cc.color(8,192,118,255);
const sev_color = cc.color(71,141,113,255);
const eight_color = cc.color(237,241,131,255);
const nine_color = cc.color(170,131,73,255);
const ten_color = cc.color(126,82,41,255);
const ele_color = cc.color(61,55,50,255);
const tw_color = cc.color(236,180,234,255);
const thf_color = cc.color(230,63,84,255);


var color_table = [cc.color(218,123,86,255),cc.color(218,123,86,255),cc.color(219,205,208,255),cc.color(106,75,233,255),
                  cc.color(233,75,195,255),cc.color(75,201,233,255),cc.color(8,192,118,255),
                  cc.color(71,141,113,255),cc.color(237,241,131,255),cc.color(170,131,73,255),
                  cc.color(126,82,41,255),cc.color(61,55,50,255),cc.color(236,180,234,255),
                  cc.color(230,63,84,255)]
   
var mapinfo = {
    
    init() {
        this.gid = 0;
        this.gids = [];
        this.texture_names = [];
        return this;
    },

    
    parseGid(gids){
        
        let array = gids.split(";")
        

        this.gids.length = array.length;
        for (let i=0;i<array.length;i++) {
            this.gids[i] = parseInt(array[i])
        }
        this.gid = this.gids[0]
    },

    parseIcons(icons) {

        let array = icons.split(";")
        this.texture_names.length = array.length;
        for (let i=0;i<array.length;i++) {
            this.texture_names[i] =array[i]
        }
    },
    
    setCurGid(textureName) {
        let name = textureName + ".png"
        for(let i=0;i<this.texture_names.length;i++) {
            if(this.texture_names[i] == name) {
                this.gid = this.gids[i]
                console.log("select gid=========",this.gid)
                break;
            }
        }
    },
    getGid() {
        let color = color_table[1]
       
        if(this.gid < color_table.length) {
            color = color_table[this.gid]
        }
        
        return [this.gid,color];
    },
 
}

export default mapinfo.init();