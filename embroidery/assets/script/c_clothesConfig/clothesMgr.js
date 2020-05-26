import Log from '../common/Log';
import utils from '../common/utils';

var clothesMgr = {
    
    config: null,

    init(data){
        if(!data || !data.length){
            Log.catch('err---------in dressMgr 8 data: ', data);
            return
        }
        this.config = {};
        data.forEach(element => {
            if(element.type == '3'){
                if(!this.config[element.level]){
                    this.config[element.level] = []
                }
                this.config[element.level].push(element);
            }
        });

        this.loadDirForPens();
    },

    getClothes(){
        let clothesID = cc.vv.userInfo.clothesID;
        if(!clothesID){
            return this.getClothesByLevel();
        }

        for(let key in this.config){
            for(let i = 0; i < this.config[key].length; i++){
                if(this.config[key][i].id == clothesID){
                    return this.config[key][i];
                }
            }
        }
    },

    getClothesByLevel(){
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
        Log.d('getClothesByLevel::',info);
    },


    //找到资源对资源进行预加载或者重置资源
    preLoadClothes(){
        return new Promise((resolve,reject)=>{
            let clothes = cc.vv.clothesConfig = cc.vv.clothesConfig || this.getClothes();
            let name    = clothes.resource;
            let id      = clothes.id;
            let url     = 'clothes/' + name;
            utils.loadDir(url).then((asset)=>{
                if(!asset || !asset.length){
                    Log.catch('err in home 74, 预加载资源[]/err');
                    return;
                }
                for(let i = 0; i < asset.length; i++){
                    if(asset[i].name == name){
                        cc.vv.clothesDemo = asset[i];
                        continue;
                    }
                    if(asset[i].name.split('_')[1] == 'white'){
                        cc.vv.clothesDemoWhite = asset[i];
                        continue;
                    }
                    if(asset[i].name.split('_')[1] == 'clip' 
                    || asset[i].name.split('_')[1] == 'line'){
                        cc.vv.clothesClipArr.push(asset[i]);
                        continue;
                    }
                    Log.warn('加载资源时warn', asset[i]);
                }
                //全部是 texture2d 不是spriteFrame
                Log.d(cc.vv.clothesDemo);
                Log.d(cc.vv.clothesDemoWhite);
                Log.d(cc.vv.clothesClipArr);
                resolve();
            })
            cc.vv.userMgr.setUserClothes(id);
        })
    },

    penUrl: './shangse/penicon',
    //上色的笔
    loadDirForPens(){
        utils.loadDir(this.penUrl, cc.SpriteFrame).then((asset)=>{
            if(!asset.length){
                Log.catch('err in clothesMgr 108',asset);
                return
            }
            cc.vv.pensAsset = {};
            asset.forEach(item => {
                if(!cc.vv.pensAsset[item.name]){
                    let key = item.name.split('_')[1];
                    cc.vv.pensAsset[key] = item;
                }
            })
        })
    }
}

export default clothesMgr;