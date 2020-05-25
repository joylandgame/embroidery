import userConfig from './userConfig'; //{userSkins, userConfig}
import localSave  from '../common/localSave';

var userInfo   = {
    name: 'sxy',
}

const userMgr = {

    evt_user_config: 'evt_user_config',

    init(){

        let dt   = localSave.get(userMgr.evt_user_config);
        if(dt){
            for(let key in dt){
                userInfo[key] = dt[key];
            }
        }
        for(let key in userConfig){
            if(userInfo[key] === undefined){
               userInfo[key] = userConfig[key];
            }
        }
        localSave.set(userMgr.evt_user_config, userInfo);
    },

    setUserLevel(number){
        if(!number){return} //不能传入0;关卡从1开始
        userInfo.level = number;
        let dt = userInfo;
        localSave.set(userMgr.evt_user_config, dt);
    },

    addUserGold(number){
        let gold = userInfo.gold + number;
        if(gold<0){
            let eventName = cc.vv.eventName.gold_not_enough;
            return eventName;
        }
        userInfo.gold = gold;
        let dt = userInfo;
        localSave.set(userMgr.evt_user_config, dt);
    },

    setUserClothes(clothesID){
        if(clothesID){
            userInfo.clothesID = clothesID;
            let dt = userInfo;
            localSave.set(userMgr.evt_user_config, dt);
        }
    },

    setUserTiledMap(mapID){
        if(mapID){
            userInfo.mapID = mapID;
            let dt = userInfo;
            localSave.set(userMgr.evt_user_config, dt);
        }
    },

    clearUserGameInfo(){
        userInfo.clothesID = '';
        userInfo.mapID     = '';
        let dt = userInfo;
        localSave.set(userMgr.evt_user_config, dt);
    },

    setUserBonus(number){
        if(number){
            userInfo.bonus = Number(number);
            let dt = userInfo;
            localSave.set(userMgr.evt_user_config, dt);
        }
    },

    setUserUpgradeLv(number){
        if(number){
            number = number > 50 ? 50 : number;
            userInfo.upgradeLv = number;
            let dt = userInfo;
            localSave.set(userMgr.evt_user_config, dt);
            if(cc.vv.upgrade){
                let bonus = cc.vv.upgrade[number].bonus;
                userMgr.setUserBonus(bonus);
            }
        }
    },

    setUserGudie(index){
        if(index !== undefined){
            if(!userInfo.guide){
                userInfo.guide = {};
            }
            index = index+"";
            userInfo.guide[index] = 1;
            let dt = userInfo;
            localSave.set(userMgr.evt_user_config, dt);
        }
    },

    // userPens: [],
    // userNeedles: [],
    // userScissors: [],
    
    setUserUsePen(id){
        if(!id){cc.error('setUserUsePen'+id)}
        userInfo.usePen = id;
        let dt = userInfo;
        localSave.set(userMgr.evt_user_config, dt);
    },

    setUserPens(id){
        if(!id){cc.error('setUserPens'+id)}
        let arr = userInfo.userPens;
        arr.push(id);
        const set = new Set(arr);
        arr = Array.from(set);
        userInfo.userPens = arr;
        let dt = userInfo;
        localSave.set(userMgr.evt_user_config, dt);
    },

    setUserUseNeedle(id){
        if(!id){cc.error('setUserUseNeedle'+id)}
        userInfo.useNeedle = id;
        let dt = userInfo;
        localSave.set(userMgr.evt_user_config, dt);
    },

    setUserNeedles(id){
        if(!id){cc.error('setUserNeedles'+id)}
        let arr = userInfo.userNeedles;
        arr.push(id);
        const set = new Set(arr);
        arr = Array.from(set);
        userInfo.userNeedles = arr;
        let dt = userInfo;
        localSave.set(userMgr.evt_user_config, dt);
    },

    setUserUseScissor(id){
        if(!id){cc.error('setUserUseScissor'+id)}
        userInfo.useScissor = id;
        let dt = userInfo;
        localSave.set(userMgr.evt_user_config, dt);
    },

    setUserScissors(id){
        if(!id){cc.error('setUserScissors'+id)}
        let arr = userInfo.userScissors;
        arr.push(id);
        const set = new Set(arr);
        arr = Array.from(set);
        userInfo.userScissors = arr;
        let dt = userInfo;
        localSave.set(userMgr.evt_user_config, dt);
    },


}

userMgr.init();
export {userMgr, userInfo};