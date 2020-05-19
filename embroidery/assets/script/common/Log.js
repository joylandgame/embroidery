let debug = true;
const Log = {
    
    err : (info)=>{
        if(debug){
            cc.error(info);
        }
    },

    warn : (...info)=>{
        if(debug){
            cc.warn(...info);
        }
    },

    d : (...info)=>{
        if(debug){
            console.log(...info);
        }
    },

    do : (j)=>{
        if(debug){
            console.log(JSON.stringify(j));
        }
    },

    catch : (...error)=>{
        cc.error(...error);
    }
    
}

export default Log;