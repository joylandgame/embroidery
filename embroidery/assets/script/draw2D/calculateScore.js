import Log from '../common/Log';

var difference = {};
var ignore     = null;
var mandatory  = true;

var catchErr = 150;

var calculateMgr = {
    /**
     * 
     * @param {obj}      //object/array/一个值 传入对象或者数组 key值需要一致
     * @param {ignore}   //忽略的值 传入后不算作差异 相当于缩减了比较项
     * @param {mandatory}//是否强制对比 默认为强制对比 否则本身obj属性不同或者数组长度不同会返回一个err
     */
    calculateDifference(obj_1, obj_2, key){
        let type = Object.prototype.toString.call(obj_1);
        if(type === '[object Object]'){
            this.calculateObj(obj_1, obj_2);
        }else if(type === '[object Array]'){
            this.calculateArr(obj_1, obj_2, key);
        }
    },

    calculateObj(obj_1, obj_2){
        for(let key in obj_1){
            if(!obj_2.hasOwnProperty(key)){
                if(mandatory){
                    Log.warn('in calculateMgr 26,俩个传入的对象属性上有差异/尝试将_mandatory参数去掉');
                    difference[key] = -1;
                    continue;
                }else{
                    difference = null;
                    difference = false;
                    return;
                }
            }
            let property_1 = obj_1[key];
            let property_2 = obj_2[key];
            if(!difference[key]){
                difference[key] = 0;
            }
            this.calculateDifference(property_1, property_2, key);

        }
    },

    calculateArr(arr1, arr2, key){
        if(!mandatory){
            if(arr1.length != arr2.length){
                Log.warn('in calculateMgr 50,俩个传入的数组属性上有差异/尝试将_mandatory参数去掉');
                difference = false;
                return;
            }
        }
        if(key !== undefined){
            if(!difference[key + 'all']){
                difference[key + 'all'] = 0;
            }
        }
        if(ignore){
            let compareBase = this.maxLenArr(arr1, arr2);
            let compare     = this.minLenArr(arr1, arr2);
            let allNumber   = 0;
            for(let i = 0; i < compareBase.length; i++){
                if(compare[i] === ignore || compareBase[i] === ignore){continue}
                if(compare[i] !== compareBase[i]){
                    if(difference[key] !== undefined){
                        difference[key] = difference[key]+1;
                    }
                }
                allNumber++;
            }
            if(difference[key + 'all']!==undefined){difference[key+'all'] = allNumber}

        }
    },

    minLenArr(arr1,arr2){
        return arr2.length <= arr1.length ? arr2 : arr1;
    },

    maxLenArr(arr1,arr2){
        return arr1.length >= arr2.length ? arr1 : arr2;
    }
}

class calculate{

    constructor(_ignore, _mandatory){
        mandatory  = true;
        difference = {};
        ignore     = null;
        if(ignore !== undefined){ignore = _ignore;}
        if(mandatory !== undefined){mandatory = _mandatory;}
    }

    toCompare(o1,o2){
        if(typeof o1 != typeof o2){
            Log.warn('in calculateMgr 10,相比较的俩个值类型不同')
            return false;
        }
        calculateMgr.calculateDifference(o1,o2);
        return difference;
    }

    getScore(data){
        if(!data){return}
        if(Object.prototype.toString.call(data) !== '[object Object]'){
            Log.catch("in calculateMgr 110,传入类型错误----difference")
            return;
        }
        let key = 0;
        let all_score = 0;
        let times = 0;

        while(true){
            if(data[key] === undefined){break}
            times += 1;
            let baseScore = 100;
            let diffPoint = data[key];
            let allPoint  = data[key + "all"];
            if(allPoint){
                all_score += baseScore*(allPoint-diffPoint)/allPoint;
            }
            key += 1;
            if(times>catchErr){
                Log.catch("in calculateMgr 127,可能算分时溢出 times",times)
                return -1;
            }
        }
        return Math.ceil(all_score / times);
    }

}

export default calculate;