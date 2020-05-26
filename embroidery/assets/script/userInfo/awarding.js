
import localSave  from '../common/localSave';
import Log from '../common/Log';

var awardingMgr = {
    
    evt_reward_config: 'evt_reward_config',

    addRewardTimesByKey(key, id){
        let data = localSave.get(awardingMgr.evt_reward_config);
        if(!data){
            data = {};
        }
        if(!data[key]){
            data[key] = {};
        }
        if(!data[key][id]){
            data[key][id] = 0;
        }
        data[key][id] += 1;
        localSave.set(awardingMgr.evt_reward_config, data);
    },

    getRewardByKey(key, id){
        let data = localSave.get(awardingMgr.evt_reward_config);
        if(!data){
            data = {};
        }
        if(!data[key]){
            data[key] = {};
        }
        if(!data[key][id]){
            data[key][id] = 0;
            localSave.set(awardingMgr.evt_reward_config, data);
        }
        let times = data[key][id];
        return times;
    }
}

export default awardingMgr;