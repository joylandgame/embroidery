import Log from '../common/Log';
import localSave from '../common/localSave';
import utils from '../common/utils';
var skinTryMgr = {
    
    evt_skinTry_config: 'evt_skinTry_config',

    //获取时 + 1
    getTrySkinInfo(){
        let info = localSave.get(skinTryMgr.evt_skinTry_config);
        if(!info){
            info = {};
            info['closeDate'] = '';
            info['count']     = 0;
        }
        let today = utils.getFormatData();
        if(info['closeDate']){
            if(today == info['closeDate']){
                return null;
            }else{
                info['closeDate'] = '';
                info['count']     = 0;
            }
        }
        info['count'] += 1;
        localSave.set(skinTryMgr.evt_skinTry_config, info);
        return info['count'];
    },

    closeToday(){
        let date = utils.getFormatData();
        let info = localSave.get(skinTryMgr.evt_skinTry_config);
        info['closeDate'] = date;
        localSave.set(skinTryMgr.evt_skinTry_config, info);
    }
}

export default skinTryMgr;