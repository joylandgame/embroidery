import drawUint8Array from './drawUint8Array';
import {drawUtilsMgr,drawConfig} from './drawConfig';//drawUtilsMgr是个画笔 drawconfig是类型的定义
var ctrlComponent = require('./drawCtrl');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    //初始化画板的数据 包括画笔
    init(game){
        this.game = game;
        this.ctrlNode = null; //用户操作 画的那个node
        this.ctrlMgr  = null; //给node 加入的那个 控制脚本

        this.drawUtilsMgr = null; //画笔类
        this.drawUtils    = null; //画笔 通过画笔类去获取
        this.lastColorPen = null; //最后一支笔（当前的笔 但不是橡皮擦）
        this.drawUint8Array = null; //这是一个drawUint8Array
    },

    //设置线条宽度
	setLineWidth(lineWidth) {
		this.lineWidth = lineWidth;
		this.drawUint8Array.setLineWidth(this.lineWidth);
    },
    
    initDraw(){
        if(this._drawNode){
            this._drawNode.parent = null;
            this._drawNode.destroy();
            this._drawNode = null;
        }
        let size = this.drawNode.getContentSize();
		this._width = size.width;
		this._height = size.height;

		let data = this.drawUint8Array.getData();
		let texture = new cc.Texture2D();
        texture.initWithData(data, 16, this._width, this._height); 
        
        this._drawNode = new cc.Node();
		this.drawSprite = this._drawNode.addComponent(cc.Sprite);
		this.drawSprite.spriteFrame = new cc.SpriteFrame(texture);
        this._drawNode.parent = this.drawNode;
    },

    //对应打开状态的 uint8 mgr中的属性
    resetStroke() {
        let strokeColor = this.drawUtils.color;
        let lineWidth = this.drawUtils.width;
		this.drawUint8Array.setColor(strokeColor.getR(), strokeColor.getG(), strokeColor.getB(), strokeColor.getA());
		this.drawUint8Array.setLineWidth(lineWidth);
    },

    /***************************************drawTabMgr————Control***********************************************/
    //传入的node是一个画布模型
    initModel(node, drawPixels, data){
        this.drawNode = node;
        this.drawUint8Array = drawUint8Array;
        this.drawUint8Array.init(node.width, node.height, drawPixels);
        this.drawUint8Array.reset(data);
        this.initDraw();
        //初始画布后 初始化画布控制类
        this.ctrlNode = node;
        this.ctrlMgr = this.ctrlNode.addComponent(ctrlComponent);
        this.ctrlMgr.init(this);
    },
    //修改画笔
    setDrawUtils(id,info){ //橡皮擦不用传入info
        if(!this.drawUtilsMgr){this.drawUtilsMgr = new drawUtilsMgr();}
        this.drawUtilsMgr.setDrawType(id, info);
        this.drawUtils = null;
        this.drawUtils = this.drawUtilsMgr.getUse();
        this.lastColorPen = this.drawUtilsMgr.getLastColorPen();
        this.ctrlMgr.set_drawUtilsInfo(this.drawUtils, this.lastColorPen);
        this.resetStroke();
    },
    //点击重置按钮
    withdraw(){
        if(this.ctrlMgr){this.ctrlMgr.withdraw()}
    },
    //获取玩家操作的uint8Arr
    getData(){
        return this.drawUint8Array.copyData();
    },
    //获取操作画板 返回一个sprite 可通过纹理获得一个texture实例
    getDrawSpr(){
        return this.drawSprite; 
    },
    //关闭画板的触摸
    closeDrawNodeTouch(){
        if(this.ctrlMgr){
            this.ctrlMgr.removeEvent();
        }
    }
    


})