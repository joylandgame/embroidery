import Log from './common/Log';
var game = null;

export default class gameMgr {
    
    constructor(){
        if(game){return game}
        game = this;

        this.tailorID     = 0;
        this.drawID       = 1;
        this.embroideryID = 2;

        this.isComplete   = 1;
        this.noComplete   = 0;

        this.complete   = [0,0,0]; //裁剪 上色 刺绣
        this.drawData = null;//用户画的东西
        this.embroideryData = null;//用户刺的东西
    }

    clean(){
        this.complete   = [this.noComplete,this.noComplete,this.noComplete];
        this.drawData = null;
    }

    getAnyOneIsComplete(id){
        let n = this.noComplete;
        switch(id){
            case this.tailorID:
            case this.drawID:
            case this.embroideryID:
                n = this.complete[id];
                break;
            default:
                Log.catch('参数错误in gameMgr.js 45');
                break;
        }
        return n === this.isComplete;
    }

    completeAnyOne(id){
        if(this.complete[id] === this.isComplete){Log.warn('重复完成',id)}
        this.complete[id] = this.isComplete;
    }

    setDrawData(data){
        if(data){this.drawData = data}
    }

    getDrawData(){
        return this.drawData;
    }

    setEmbroideryData(data){
        if(data){this.embroideryData = data}
    }

    getEmbroideryData(){
        return this.embroideryData;
    }

    //判断是否完成了游戏
    completeGames(){
        let completeNum = 0;
        completeNum += this.complete[this.tailorID]     === this.isComplete ? 1 : 0;
        completeNum += this.complete[this.drawID]       === this.isComplete ? 1 : 0;
        completeNum += this.complete[this.embroideryID] === this.isComplete ? 1 : 0;
        return completeNum >= this.complete.length;
    }

    canSelect(id){
        let idx = id;
        if(idx - 1 < 0){return true}
        if(id == this.embroideryID){return true}
        return this.complete[idx-1] === this.isComplete;
    }

}