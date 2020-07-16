import Log from '../common/Log';
import utils from '../common/utils';

var skinMgr = {

    defaultKey : '0',
    scissorKey : '1',
    penKey     : '2',
    needleKey  : '3',

    defaultPen    : '',
    defaultNeedle : '',
    defaultScissor: '',

    usePenInfo: '',
    useNeedleInfo: '',
    useScissorInfo: '',

    try_UsePenInfo: '',
    try_UseNeedleInfo: '',
    try_UseScissorInfo: '',

    havePenInfo: '',
    haveNeedleInfo: '',
    haveScissorInfo: '',

    config: {},

    init(skinInfo){
        
        if(!skinInfo||!skinInfo.length){return Log.catch('加载皮肤json error',skinInfo)}
        skinInfo.forEach(element => {
            if(element.type == this.scissorKey){
                if(!this.config[this.scissorKey]){
                    this.config[this.scissorKey] = [];
                }
                this.config[this.scissorKey].push(element);
                if(element.unlock_type == this.defaultKey){
                    this.defaultScissor = element;
                }
            }
            if(element.type == this.penKey){
                if(!this.config[this.penKey]){
                    this.config[this.penKey] = [];
                }
                this.config[this.penKey].push(element);
                if(element.unlock_type == this.defaultKey){
                    this.defaultPen = element;
                }
            }
            if(element.type == this.needleKey){
                if(!this.config[this.needleKey]){
                    this.config[this.needleKey] = [];
                }
                this.config[this.needleKey].push(element);
                if(element.unlock_type == this.defaultKey){
                    this.defaultNeedle = element;
                }
            }
        });

        Log.d('skinInfo ::', this.config);

        this.usePenInfo     = this.getUserUsePen();
        this.useNeedleInfo  = this.getUserUseNeedle();
        this.useScissorInfo = this.getUserUseScissor();
        
        this.havePenInfo     = this.getUserPens();
        this.haveNeedleInfo  = this.getUserNeedles();
        this.haveScissorInfo =  this.getUserScissors();
    },

    getSkinsInfo(key){
        if(this.config && this.config[key]){
            return this.config[key];
        }
    },

    getTrySkinInfo(key){
        switch(key){
            case this.penKey:
                if(this.try_UsePenInfo){
                    return this.try_UsePenInfo;
                }
            break;

            case this.needleKey:
                if(this.try_UseNeedleInfo){
                    return this.try_UseNeedleInfo;
                }
            break;

            case this.scissorKey:
                if(this.try_UseScissorInfo){
                    return this.try_UseScissorInfo;
                }
            break;
        }
            return null;
    },

    getSkinInfo(key, id){        
        if(this.config && this.config[key]){
            let info = this.config[key];
            if(info.length){
                for(let i = 0; i < info.length; i++){
                    if(info[i].id == id){
                        return info[i];
                    }
                }
            }
        }
    },

    getSkinInfoById(id){
        if(this.config){
            for(let key in this.config){
                let info = this.config[key];
                for(let i = 0; i < info.length; i++){
                    if(info[i].id == id){
                        return info[i];
                    }
                }
            }
        }
    },

    //****get****/
    getUserUsePen(){
        let id = cc.vv.userInfo.usePen;
        if(!id){
            id = this.defaultPen.id;
            cc.vv.userMgr.setUserUsePen(id);
            return this.defaultPen;
        }
        let pen = this.getSkinInfo(this.penKey, id);
        return pen;
    },
    getUserUseNeedle(){
        let id = cc.vv.userInfo.useNeedle;
        if(!id){
            id = this.defaultNeedle.id;
            cc.vv.userMgr.setUserUseNeedle(id);
            return this.defaultNeedle;
        }
        let needle = this.getSkinInfo(this.needleKey, id);
        return needle;
    },

    getUserUseScissor(){
        let id = cc.vv.userInfo.useScissor;
        if(!id){
            id = this.defaultScissor.id;
            cc.vv.userMgr.setUserUseScissor(id);
            return this.defaultScissor;
        }
        let scissor = this.getSkinInfo(this.scissorKey, id);
        return scissor;
    },

    getUserPens(){
        let idArr = cc.vv.userInfo.userPens;
        if(!idArr||!idArr.length){
            let addId = this.defaultPen.id;
            cc.vv.userMgr.setUserPens(addId);
            return [this.defaultPen];
        }
        let userPens = [];
        for(let i = 0; i < idArr; i++){
            userPens.push(this.getSkinInfo(this.penKey, idArr[i]));
        }
        return userPens;
    },

    getUserNeedles(){
        let idArr = cc.vv.userInfo.userNeedles;
        if(!idArr||!idArr.length){
            let addId = this.defaultNeedle.id;
            cc.vv.userMgr.setUserNeedles(addId);
            return [this.defaultNeedle];
        }
        let userNeedles = [];
        for(let i = 0; i < idArr; i++){
            userNeedles.push(this.getSkinInfo(this.needleKey, idArr[i]));
        }
        return userNeedles;
    },

    getUserScissors(){
        let idArr = cc.vv.userInfo.userScissors;
        if(!idArr||!idArr.length){
            let addId = this.defaultScissor.id;
            cc.vv.userMgr.setUserScissors(addId);
            return [this.defaultScissor];
        }
        let userScissors = [];
        for(let i = 0; i < idArr; i++){
            userScissors.push(this.getSkinInfo(this.scissorKey, idArr[i]));
        }
        return userScissors;
    },

    //****set****//
    setUserUsePen(id){
        cc.vv.userMgr.setUserUsePen(id);
        this.usePenInfo = this.getSkinInfo(this.penKey, id);
    },

    setUserPens(id){
        let pens = cc.vv.userInfo.userPens;
        cc.vv.userMgr.setUserPens(id);
        if(pens.indexOf(id)<0){
            this.havePenInfo.push(this.getSkinInfo(this.penKey, id));
        }
    },

    setUserUseNeedle(id){
        cc.vv.userMgr.setUserUseNeedle(id);
        this.useNeedleInfo = this.getSkinInfo(this.needleKey, id);
    },

    setUserNeedles(id){
        let needles = cc.vv.userInfo.userNeedles;
        cc.vv.userMgr.setUserNeedles(id);
        if(needles.indexOf(id)<0){
            this.haveNeedleInfo.push(this.getSkinInfo(this.needleKey, id));
        }
    },

    setUserUseScissor(id){
        cc.vv.userMgr.setUserUseScissor(id);
        this.useScissorInfo = this.getSkinInfo(this.scissorKey, id);
    },

    setUserScissors(id){
        let scissors = cc.vv.userInfo.userScissors;
        cc.vv.userMgr.setUserScissors(id);
        if(scissors.indexOf(id)<0){
            this.haveScissorInfo.push(this.getSkinInfo(this.scissorKey, id));
        }
    },

    //****get_trySkin****/
    //get到一个随机皮肤后 在外部再调用set 将this的试用皮肤赋值
    //传入key 取得一个类型的随机皮肤 不传入key从三个类型里随机一个
    getTrySkin(key){
        let havePens   = cc.vv.userInfo.userPens;
        let noHavePens = [];
        let configPens = this.config[this.penKey];
        for(let i = 0; i < configPens.length; i++){
            if(havePens.indexOf(configPens[i].id) < 0){
                noHavePens.push(configPens[i]);
            }
        }
        let haveScissors   = cc.vv.userInfo.userScissors;
        let noHaveScissors = [];
        let configScissors = this.config[this.scissorKey];
        for(let i = 0; i < configScissors.length; i++){
            if(haveScissors.indexOf(configScissors[i].id) < 0){
                noHaveScissors.push(configScissors[i]);
            }
        }
        let haveNeedles   = cc.vv.userInfo.userNeedles;
        let noHaveNeedles = [];
        let configNeedles = this.config[this.needleKey];
        for(let i = 0; i < configNeedles.length; i++){
            if(haveNeedles.indexOf(configNeedles[i].id) < 0){
                noHaveNeedles.push(configNeedles[i]);
            }
        }

        let penWeight     = 0;
        let scissorWeight = 0;
        let needleWeight  = 0;

        if(key == this.penKey || !key){
            noHavePens.forEach(e=>{
                penWeight += Number(e.skin_try_weight);
            })
        }

        if(key == this.needleKey || !key){
            noHaveNeedles.forEach(e=>{
                needleWeight += Number(e.skin_try_weight);
            })
        }

        if(key == this.scissorKey || !key){
            noHaveScissors.forEach(e=>{
                scissorWeight += Number(e.skin_try_weight);
            })
        }


        let allWeight = penWeight+scissorWeight+needleWeight;
        if(allWeight == 0){return null}

        let infoArr = [noHavePens, noHaveNeedles, noHaveScissors];

        let randomWeight = Math.random()*allWeight;
        let addWeight    = 0;
        for(let index = 0; index < 3; index++){
            addWeight += [penWeight,needleWeight,scissorWeight][index];
            if(addWeight >= randomWeight){
                let info = infoArr[index];
                let _allWeight = 0;
                info.forEach(e=>{
                    _allWeight+=Number(e.skin_try_weight);
                })
                let _randomWeight = Math.random()*_allWeight;
                let _addWeight    = 0;
                for(let i = 0; i < info.length; i++){
                    _addWeight+=Number(info[i].skin_try_weight);
                    if(_addWeight>=_randomWeight){
                        return info[i];
                    }
                }
            }
        }
    },

    setTrySkin(info){
        Log.d('获得试用皮肤成功--仅一局有效:',info);
        switch(info.type){
            case this.scissorKey:
                this.try_UseScissorInfo = info;
            break;

            case this.penKey:
                this.try_UsePenInfo = info;
            break;

            case this.needleKey:
                this.try_UseNeedleInfo = info;
            break;
        }
    },

    clearTrySkin(){
        this.try_UseNeedleInfo = null;
        this.try_UsePenInfo = null;
        this.try_UseScissorInfo = null;
    },

    //****预加载资源****/

    pensSkinUrl     : './skin/pen',
    needlesSkinUrl  : './skin/needle',
    scissorsSkinUrl : './skin/scissor',

    preLoadPensSkin(){
        utils.loadDir(this.pensSkinUrl, cc.SpriteFrame).then((asset)=>{
            if(!asset.length){
                Log.catch('err in skinMgr 344',asset);
                return
            }
            cc.vv.pensSkin = {};
            asset.forEach(item => {
                if(!cc.vv.pensSkin[item.name]){
                    let key = item.name;
                    cc.vv.pensSkin[key] = item;
                }
            })
        })
    },

    preLoadNeedlesSkin(){
        utils.loadDir(this.needlesSkinUrl, cc.SpriteFrame).then((asset)=>{
            if(!asset.length){
                Log.catch('err in skinMgr 360',asset);
                return
            }
            cc.vv.needlesSkin = {};
            asset.forEach(item => {
                if(!cc.vv.needlesSkin[item.name]){
                    let key = item.name;
                    cc.vv.needlesSkin[key] = item;
                }
            })
        })
    },

    preLoadScissorsSkin(){
        utils.loadDir(this.scissorsSkinUrl, cc.SpriteFrame).then((asset)=>{
            if(!asset.length){
                Log.catch('err in skinMgr 378',asset);
                return
            }
            cc.vv.scissorsSkin = {};
            asset.forEach(item => {
                if(!cc.vv.scissorsSkin[item.name]){
                    let key = item.name;
                    cc.vv.scissorsSkin[key] = item;
                }
            })
        })
    },
}

export default skinMgr;