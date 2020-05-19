
const localSave = {
    use_encryption: false, //是否存储加密
    encrypt: (code)=>{
        if(!code){return code}
        var c=String.fromCharCode(code.charCodeAt(0)+code.length);  
        for(var i=1;i<code.length;i++){        
            c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
        }     
        return escape(c);
    },
    //字符串进行解密   
    decrypt : (code)=>{
        if(!code){return code}
        code = unescape(code);        
        var c=String.fromCharCode(code.charCodeAt(0)-code.length);        
        for(var i=1;i<code.length;i++){        
            c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));        
        }       
        return c;
    },

    set : (key, info)=>{
        if(!key){return}
        let data = JSON.stringify(info);
        if(localSave.use_encryption){
            data = localSave.encrypt(data);
        }
        cc.sys.localStorage.setItem(key,data);
    },

    get : (key)=>{
        if(!key){return}
        let data = cc.sys.localStorage.getItem(key);
        if(localSave.use_encryption){
            data = localSave.decrypt(data);
        }
        return data ? JSON.parse(data) : null;
    }

}

export default localSave;