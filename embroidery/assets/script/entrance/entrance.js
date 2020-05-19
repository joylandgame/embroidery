
var gameConfig = {
    part: '',
    signin: '',
    skin: '',
    upgrade: '',

    loadConfigOver: false,
    loadResolve: '',
}

var entrance = {
    
    init(){
        Promise.all([
            this.loadpart(),
            this.loadsignin(),
            this.loadskin(),
            this.loadupgrade(),
        ]).then((data)=>{
            gameConfig.loadConfigOver = true;
            gameConfig.part = data[0];
            gameConfig.signin = data[1];
            gameConfig.skin = data[2];
            gameConfig.upgrade = data[3];
            gameConfig.loadResolve && gameConfig.loadResolve();
        })
    },

    loadpart(){
        return new Promise((resolve, reject)=>{
            cc.loader.loadRes('jsonInfo/part',(err, data)=>{
                if(err){
                    console.log('error---------in entrance 34',err);
                    return
                }
                if(data && data['json']){
                    resolve(data['json']);
                    return
                }
                resolve([]);
            })
        })
    },

    loadsignin(){
        return new Promise((resolve, reject)=>{
            cc.loader.loadRes('jsonInfo/signin',(err, data)=>{
                if(err){
                    console.log('error---------in entrance 50',err);
                    return
                }
                if(data && data['json']){
                    resolve(data['json']);
                    return
                }
                resolve([]);
            })
        })
    },

    loadskin(){
        return new Promise((resolve, reject)=>{
            cc.loader.loadRes('jsonInfo/skin',(err, data)=>{
                if(err){
                    console.log('error---------in entrance 66',err);
                    return
                }
                if(data && data['json']){
                    resolve(data['json']);
                    return
                }
                resolve([]);
            })
        })
    },

    loadupgrade(){
        return new Promise((resolve, reject)=>{
            cc.loader.loadRes('jsonInfo/upgrade',(err, data)=>{
                if(err){
                    console.log('error---------in entrance 82',err);
                    return
                }
                if(data && data['json']){
                    resolve(data['json']);
                    return
                }
                resolve([]);
            })
        })
    }

}

entrance.init();
export default gameConfig;