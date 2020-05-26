import Log from '../common/Log';
import utils from '../common/utils';

var tiledMapMgr = {
    config: null,

    init(data){
        if(!data || !data.length){
            Log.catch('err---------in tiledMapMgr 8 data: ', data);
            return
        }
        this.config = {};
        data.forEach(element => {
            if(element.type == '2'){
                if(!this.config[element.level]){
                    this.config[element.level] = []
                }
                this.config[element.level].push(element);
            }
        });

        this.loadDirForLines();
    },

    getTiledMap(){
        let mapID = cc.vv.userInfo.mapID;
        if(!mapID){
            return this.getTiledMapByLevel();
        }

        for(let key in this.config){
            for(let i = 0; i < this.config[key].length; i++){
                if(this.config[key][i].id == mapID){
                    return this.config[key][i];
                }
            }
        }
    },

    getTiledMapByLevel(){
        let lv   = cc.vv.userInfo.level;
        let info = [];
        for(let key in this.config){
            if(Number(key)<=lv){
                info = info.concat(this.config[key]);
            }
        }
        let allWeight = 0;
        info.forEach(element => {
            allWeight += Number(element.weight);
        });
        let random = Math.random()*allWeight;
        let addWeight = 0;
        for(let i = 0; i < info.length; i++){
            addWeight += Number(info[i].weight);
            if(addWeight >= random){
                return info[i];
            }
        }
        Log.d('getTiledMapByLevel::',info);
    },

    preLoadTiledMap(){
        return new Promise((resolve,reject)=>{
            let map     = cc.vv.tiledMapConfig = cc.vv.tiledMapConfig || this.getTiledMap();
            let name    = map.resource;
            let id      = map.id;
            let url     = './tilemap/' + name + ".tmx";
            utils.loadTexture(url).then((map)=>{
                if(!map){
                    Log.catch('err in tiledMapMgr 71, 预加载资源 url:',url);
                    return;
                }
                cc.vv.tiledMapDemo = map;
                resolve();
            })
            cc.vv.userMgr.setUserTiledMap(id);
        })
    },

    lineUrl: './cixiu/cixiuicon',
    loadDirForLines(){
        utils.loadDir(this.lineUrl, cc.SpriteFrame).then((asset)=>{
            if(!asset.length){
                Log.catch('err in tileMapMgr 85',asset);
                return
            }
            cc.vv.linesAsset = {};
            asset.forEach(item => {
                if(!cc.vv.linesAsset[item.name]){
                    cc.vv.linesAsset[item.name] = item;
                }
            })
        })
    }
}

export default tiledMapMgr;