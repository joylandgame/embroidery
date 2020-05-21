import Log from './common/Log';
var game = null;

export default class gameMgr {
    
    constructor(){
        if(game){return game}
        game = this;

        this.tailorID     = 0;
        this.drawID       = 1;
        this.embroideryID = 2;
        this.putEmbroideryID = 3;

        this.isComplete   = 1;
        this.noComplete   = 0;

        this.complete   = [0,0,0,0]; //裁剪 上色 刺绣
        this.drawData   = null;//用户画的东西
        this.embroideryData = null;//用户刺的东西
        this.putEmbroideryData = null;//用户摆放的东西

        this.performDrawData = null;
        this.performEmbroideryData = null;
    }

    clean(){
        this.complete   = [this.noComplete,this.noComplete,this.noComplete,this.noComplete];
        
        this.drawData   = null;
        this.embroideryData = null;//用户刺的东西
        this.putEmbroideryData = null;//用户摆放的东西

        this.performDrawData = null;
        this.performEmbroideryData = null;
    }

    getAnyOneIsComplete(id){
        let n = this.noComplete;
        switch(id){
            case this.tailorID:
            case this.drawID:
            case this.embroideryID:
            case this.putEmbroideryID:
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
    //{pos, scale, angle}
    setPutEmbroideryData(data){ 
        if(data){this.putEmbroideryData = data}
    }

    getPutEmbroideryData(){
        return this.putEmbroideryData;
    }

    //判断步骤完成情况
    confirmGameCompletion(){
        let lastStep  = 0;
        let finalStep = 0;
        lastStep  += this.complete[this.tailorID]     === this.isComplete ? 1 : 0;
        lastStep  += this.complete[this.drawID]       === this.isComplete ? 1 : 0;
        lastStep  += this.complete[this.embroideryID] === this.isComplete ? 1 : 0;
        finalStep += this.complete[this.putEmbroideryID] === this.isComplete ? 1 : 0;
        return {
            finalStep: lastStep == this.complete.length - 1,
            complete : (lastStep + finalStep) == this.complete.length
        };
    }

    canSelect(id){
        // let idx = id;
        // if(idx - 1 < 0){return true}
        // if(id == this.embroideryID){return true}
        // return this.complete[idx-1] === this.isComplete;
        return this.complete[this.tailorID] === this.isComplete;
    }

    jumpToNextStage(id){
        let selectID = Number(id);
        let nextID = selectID + 1;
        if(nextID >= this.complete.length){nextID = selectID}
        return nextID;
    }

    //{spriteFrame score}
    setPerformDrawData(data){
        if(data){this.performDrawData = data}
    }

    
    setPerformEmbroideryData(data){
        if(data){this.performEmbroideryData = data}
    }

    //{spriteFrame score}
    getPerformDrawData(){
        return this.performDrawData;
    }

    getPerformEmbroideryData(){
        return this.performEmbroideryData;
    }
}