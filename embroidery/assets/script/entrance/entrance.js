
var gameConfig = {
    config_1: '',
    config_2: '',
    config_3: '',

    loadConfigOver: false,
    loadResolve: '',
}

var entrance = {
    
    init(){
        Promise.all([
            this.loadConfig_1(),
            this.loadConfig_2(),
            this.loadConfig_3(),
        ]).then((data)=>{
            gameConfig.loadConfigOver = true;
            gameConfig.config_1 = data[0];
            gameConfig.config_2 = data[1];
            gameConfig.config_3 = data[2];
            gameConfig.loadResolve && gameConfig.loadResolve();
        })
    },

    loadConfig_1(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve(1);
            },1000)
            // resolve(1);
        })
    },

    loadConfig_2(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve(2);
            },1000)
            // resolve(2);
        })
    },

    loadConfig_3(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve(3);
            },1000)
            // resolve(3);
        })
    }

}

entrance.init();
export default gameConfig;