import Log from '../common/Log';

var drawConfig = {
    utils: '',

    linePen: 1,
    circlePen: 2,
    eraser: 3,
}

//创建一个画笔之后 要设置他的类型 否则不创建画笔info

class drawUtilsMgr{
    constructor(){
        if(drawConfig.utils){
            return drawConfig.utils;
        }
        drawConfig.utils = this;
        //直线 实心的
        this.line_pen  = {
            id: 1,
            width: 30,
            color: new cc.Color(0,0,0,0),
            haveColor: true
        }
        //圆圈 空心的
        this.circle_pen = {
            id: 2,
            width: 15, //半径 
            color: new cc.Color(0,0,0,0),
            haveColor: true
        }
        //橡皮擦
        this.eraser = {
            id: 3,
            width: 30,
            color: new cc.Color(0,0,0,0),
            haveColor: false
        }

        this.use = null; //当前使用的
        this.lastColorPen = null; //最后使用的一支笔 带颜色的不包括橡皮擦
    }

    setDrawType(id, info){
        this.use = null;
        switch(id){
            case this.line_pen.id:
                this.line_pen.color = info;
                this.lastColorPen = this.use = this.line_pen; 
            break;
            case this.circle_pen.id:
                this.circle_pen.color = info;
                this.lastColorPen = this.use = this.circle_pen; 
            break;
            case this.eraser.id:
                this.use = this.eraser; 
            break;
            default:
                Log.catch('未设置默认画笔,请检查传入画笔类型'); 
            break;
        }
    }

    getUse(){
        return this.use || null;
    }

    getLastColorPen(){
        return this.lastColorPen || null;
    }

}

export {drawUtilsMgr,drawConfig}