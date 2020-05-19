import userConfig from './userConfig';
import localSave from '../common/localSave';

var userInfo  = {
    name: 'sxy',
}

const userMgr = {

    evt_user_config: 'evt_user_config',

    init(){
        let dt = localSave.get(userMgr.evt_user_config);
        if(!dt){
            dt = userConfig;
            localSave.set(userMgr.evt_user_config, dt);
        }
        for(let key in dt){
            userInfo[key] = dt[key]
        } 
    },

    setUserLevel(number){
        if(!number){return} //不能传入0;关卡从1开始
        userInfo.level = number;
        let dt = userInfo;
        localSave.set(userMgr.evt_user_config, dt);
    },

    setUserGold(number){
        let gold = userInfo.gold + number;
        if(gold<0){
            let eventName = cc.vv.eventName.gold_not_enough;
            return eventName;
        }
        userInfo.gold = gold;
        localSave.set(userMgr.evt_user_config, dt);
    }
    

}

userMgr.init();
export {userMgr, userInfo};