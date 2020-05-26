import Log from './Log';

Date.prototype.Format = function(fmt)   
{   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  }   
  for(var k in o)  {
    if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
    }
  } 
  return fmt;   
}

const utils = {
    loadJson :  (url, call)=>{
        return new Promise((resolve, reject)=>{
            cc.loader.loadRes(url, (err, data)=>{
                call && call();
                if(err){
                    Log.catch(err);
                    return;
                }
                resolve(data);
            })
        })
    },

    loadPrefab : (url, parent ,call)=>{
        return new Promise((resolve,reject)=>{
            cc.loader.loadRes(url, (err, data)=>{
                call && call();
                if(err){
                    Log.catch(err);
                    return;
                }
                if(parent){
                    let node = cc.instantiate(data);
                    node.parent = parent;
                    resolve(node);
                    return;
                }
                resolve(data);
            })
        })
    },

    loadSpriteFrame(url,spr){
        return new Promise((resolve,reject)=>{
            cc.loader.loadRes(url, cc.SpriteFrame,(err, frame)=>{
                if(err){
                    Log.catch(err);
                    return;
                }
                if(spr){
                    spr.spriteFrame = frame;
                    resolve(frame);
                    return;
                }
                resolve(frame);
            })
        })
    },

    loadTexture(url, sprite){
        return new Promise((resolve,reject)=>{
            cc.loader.loadRes(url, (err, texture)=>{
                if(err){
                    Log.catch(err);
                    return;
                }
                if(sprite){
                    sprite.spriteFrame = new cc.SpriteFrame(texture);
                    return;
                }
                resolve(texture);
            })
        })
    },

    loadSpriteFrameByHttp(url,spr){
        return new Promise((resolve,reject)=>{
            try {
                // if(!cc.sys.isNative){
                //     return;
                // }
                cc.loader.load(url, (err, texture)=>{
                    if(err){
                        Log.catch(err);
                        return;
                    }
                    let frame = new SpriteFrame(texture)
                    if(spr){
                        spr.spriteFrame = frame;
                        resolve(frame);
                        return;
                    }
                    resolve(frame);
                })
            } catch (error) {
                Log.catch(error);
            }

        })
    },

    loadSpriteAtlas: (url, call)=>{
        return new Promise((resolve, reject)=>{
            cc.loader.loadRes(url, cc.SpriteAtlas, (err, atlas) => {
                call && call();
                if(err){
                    Log.catch('没有找到该合图',url);
                    return;
                }
                resolve(atlas);
            })
        })
    },

    loadDir: (url, type = cc.Texture2D, call)=>{
        return new Promise((resolve, reject)=>{
            cc.loader.loadResDir(url,function(err,assets){
                if (err || assets.length <= 0) {
                    reject();
                    return;
                }
                let arr = [];
                for(let i = 0; i < assets.length; i++){
                    let asset = assets[i];
                    if(asset instanceof type){
                        if(cc.Texture2D === type){
                            let name = assets[i+1].name;
                            asset.name = name;
                        }
                        arr.push(asset);
                    }
                }
                resolve(arr);
                call && call();
            })
        })
    },

    //确定完全不再使用后才能清除
    //!!如果不传入url将会全部清空
    // clearSpriteAtlas: (url)=>{
    //     let idx = auxiliary.atlasArr.indexOf(url);
    //     if(idx >= 0){
    //         let clear_url = auxiliary.atlasArr.splice(idx, 1);
    //         cc.loader.release(clear_url[0]);
    //     }
    //     if(!url){
    //         auxiliary.atlasArr.forEach(element => {
    //             cc.loader.release(element);
    //         });
    //     }
    // },

    //格式化日期 返回字符串
    getFormatData(format){
        let time = '';
        time = new Date().Format('yyyy-MM-dd');
        if(format == 's'){
            time = new Date().Format('hh:mm:ss');
        }
        return time;
    },

    //振动
    vibrate(){
        if(cc.vv.userInfo){
            let vibrate = cc.vv.userInfo.systemZhenDong();
            if(vibrate == 'false'){return}
        }
        let supportsVibrate = '';
        if(navigator){
            supportsVibrate = "vibrate" in navigator;
        }
        if(supportsVibrate){
            navigator.vibrate(30);
        }else{
            if(cc.vv && cc.vv.jsbMgr){
                cc.vv.jsbMgr.otherFeatures('openVibrateShort');
            }
        }
    },

    /**将十六进制的颜色转换为RGBA颜色 */
    convertToRGBA(color) {
        return {
            r: (color & 0xef000000) >> 23,
            g: (color & 0x00ff0000) >> 16,
            b: (color & 0x0000ff00) >> 8,
            a: (color & 0x000000ff),
        };
    },

    /**
     * 将RGBA颜色分量转换为一个数值 字符串好像更耗内存
     */
    convertToRuleOut(r, g, b, a) {
        // if(a == 0){return 'x'}
        // return ""+r+g+b+a;
        if(a == 0){return 'x'}//透明区域的图片不予比较
        return ((r & 0xfe) << 23) | (g << 16) | (b << 8) | a;
    },
    /**
     * @param {*} d 默认颜色 透明度为零给个默认bg色
     */
    convertToRuleIn(r,g,b,a,d){
        // return ""+r+g+b+a;
        if(d != 'x'){
            if(a == 0){return d}
        }
        return ((r & 0xfe) << 23) | (g << 16) | (b << 8) | a;
    }
}

export default utils;