import utils from '../common/utils';
import localSave from '../common/localSave';

var signinMgr = {
    evt_signin_config: 'evt_signin_config',

    setUserSigninInfo(){
        let today = utils.getFormatData();
        let days  = signinMgr.getUserSigninInfo();
        if(days.length >= 7){return}
        days.push(today);
        localSave.set(signinMgr.evt_signin_config, days);
    },

    getUserSigninInfo(){
        let data = localSave.get(signinMgr.evt_signin_config);
        if(!data){
            data = [];
        }
        return data;
    },

    //今日是否签到
    todayIsSignin(){
        let today  = utils.getFormatData();
        let days   = signinMgr.getUserSigninInfo();
        if(days.length){
            return days.indexOf(today) >= 0;
        }
        return false;
    },

    //累计签到次数
    getSigninTimes(){
        let days = signinMgr.getUserSigninInfo();
        return days.length;
    },

    
}
export default signinMgr;