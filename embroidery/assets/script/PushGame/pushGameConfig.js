
import {MutualPush ,SizeGrid ,MinGameModel, WheelPlanting} from './model';
import {httpUtils} from './httpUtils';

var pushGameConfig = {
    mi_game_id:153,
    mi_game_name:"秀儿刺绣",
    pushgame_url:"http://pushgame.kuaizhiyou.cn/log",

    on   : 1,
    off  : 0,

    SizeGridFlag   : 1,
    MutualPushFlag : 1,
    WheelPlantingFlag : 1,
} 

var _httpUtils = new httpUtils();

var configMgr = {
    mutual_push: '',
    size_grid  : '',
    wheel_planting: '',

    SizeGridFlag   : 0,
    MutualPushFlag : 0,
    WheelPlantingFlag : 0,

    initMiConfig() {
        return this.initMutualPushFlag().then(()=>{
            return Promise.all([
                this.get_mutual_push(),
                this.get_size_grid(),
                this.get_wheel_planting()
    
            ])
        })
    },

    get_size_grid(){
        return new Promise((resolve)=>{
            let iconurl = "https://kuaizhiyou.com.cn/fenfa/icon/";
            let url = 'https://kuaizhiyou.com.cn/fenfa/nine/fenfajiugong.json';
            if (this.SizeGridFlag == 1) {
                _httpUtils.GetNetJson(url, (res) => {
                    for (let i = 1; i < res.length; i++) {
                        let json = res[i];
                        if (json["id"] == "") break;
                        if (parseInt(res[i]["id"]) == pushGameConfig.mi_game_id) {
                            let data = res[i];
                            let keys = Object.keys(data);
                            let model = new SizeGrid();
                            for (let j = 0; j < keys.length; j++) {
                                let key = keys[j];
                                if (key == "id") {
                                    model.id = parseInt(data[key]);
                                } else if (key == "des") {
                                    model.des = data[key];
                                } else if (key == "jiugong_num") {
        
                                }
                                else {
                                    if (data[key] == "") continue;
                                    let ary = key.split("_");
                                    let k = ary[1];
                                    let v = parseInt(ary[0].substring(7, ary[0].length));
                                    let m = model.list[v] || new MinGameModel();
                                    if (k == "icon") {
                                        m.icon = iconurl + data[key] + ".png";
                                    } else if (k == "apkname") {
                                        m.apk = data[key];
                                    } else {
                                        m.name = data[key];
                                    }
                                    model.list[v] = m;
                                }
                            }
                            this.size_grid = model;
                        }
                    }
                    resolve(this.size_grid);
                    return;
                });
            }else{
                resolve([]);
            }
        })
    },

    get_mutual_push(){
        return new Promise((resolve)=>{
            let iconurl = "https://kuaizhiyou.com.cn/fenfa/icon/";
            let url = "https://kuaizhiyou.com.cn/fenfa/fenfalist.json";
            if (this.MutualPushFlag == 1) {
                _httpUtils.GetNetJson(url, (res) => {
                    for (let i = 1; i < res.length; i++) {
                        let json = res[i];
                        if (json["id"] == "") break;
                        if (parseInt(res[i]["id"]) == pushGameConfig.mi_game_id) {
                            let data = res[i];
                            let keys = Object.keys(data);
                            let model = new MutualPush();
                            for (let j = 0; j < keys.length; j++) {
                                let key = keys[j];
                                if (key == "id") {
                                    model.id = parseInt(data[key]);
                                } else if (key == "des") {
                                    model.des = data[key];
                                } else if (key == "list_num") {
        
                                }
                                else {
                                    if (data[key] == "") continue;
                                    let ary = key.split("_");
                                    let k = ary[1];
                                    let v = parseInt(ary[0].substring(4, ary[0].length));
                                    let m = model.list[v] || new MinGameModel();
                                    if (k == "icon") {
                                        m.icon = iconurl + data[key] + ".png";
                                    } else if (k == "apkname") {
                                        m.apk = data[key];
                                    } else {
                                        m.name = data[key];
                                    }
                                    model.list[v] = m;
                                }
                            }
                            this.mutual_push = model;
                        }
                    }
                    resolve(this.mutual_push);
                });
            }else{
                resolve([]);
            }
        })
    },

    //初始化互推轮播列表
    get_wheel_planting() {
        return new Promise((resolve,reject)=>{
            let iconurl = "https://kuaizhiyou.com.cn/fenfa/icon/";
            let url = 'https://kuaizhiyou.com.cn/fenfa/fenfalunbo.json';
            if(this.WheelPlantingFlag == pushGameConfig.on){
                _httpUtils.GetNetJson(url, (res) => {
                    for (let i = 1; i < res.length; i++) {
                        let json = res[i];
                        if (json["id"] == "") break;
                        if (parseInt(res[i]["id"]) == pushGameConfig.mi_game_id) {
                            let data = res[i];
                            let keys = Object.keys(data);
                            let model = new WheelPlanting();
                            for (let j = 0; j < keys.length; j++) {
                                let key = keys[j];
                                if (key == "id") {
                                    model.id = parseInt(data[key]);
                                } else if (key == "des") {
                                    model.des = data[key];
                                } else if (key == "lunbo_num") {
        
                                } else if (key == "lunbo_cd") {
        
                                }
                                else {
                                    let ary = key.split("_");
                                    let k = ary[1];
                                    let v = parseInt(ary[0].substring(5, ary[0].length));
                                    if (data[key] == "") {
                                        continue;
                                    }
                                    if (k == "time") {
                                        model.times[v] = data[key];
                                    } else {
                                        let m = model.list[v] || new MinGameModel();
                                        if (k == "icon") {
                                            m.icon = iconurl + data[key] + ".png";
                                        } else if (k == "apkname") {
                                            m.apk = data[key];
                                        } else if (k == "time") {
                                        }
                                        else {
                                            m.name = data[key];
                                        }
                                        model.list[v] = m;
                                    }
                                }
                            }
                            this.wheel_planting = model;
                        }
                    }
                    resolve(this.wheel_planting)
                });
            }else{
                resolve([]);
            }
        })
    },

    initMutualPushFlag() {
        return new Promise((resolve)=>{
            let url = "https://kuaizhiyou.com.cn/fenfa/global.json";
            _httpUtils.GetNetJson(url, (res) => {
                for (let i = 1; i < res.length; i++) {
                    let falg = res[i];
                    if (parseInt(falg['id']) == pushGameConfig.mi_game_id) {
                        if (falg['jiugong_is_active'] != "" && falg['jiugong_is_active'] == "1") {
                            this.SizeGridFlag = pushGameConfig.on;
                        }
                        if (falg['list_is_active'] != "" && falg["list_is_active"] == "1") {
                            this.MutualPushFlag = pushGameConfig.on;
                        }
                        if (falg['lunbo_is_active'] != "" && falg['lunbo_is_active'] == 1) {
                            this.WheelPlantingFlag = pushGameConfig.on;
                        }
                        resolve();
                    }
                }
            });
        })
    }
}

export default configMgr
