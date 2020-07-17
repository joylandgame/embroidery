
import Log from '../common/Log';
import utils from '../common/utils';
import {drawUtilsMgr,drawConfig} from '../draw2D/drawConfig';
import calculate from '../draw2D/calculateScore';

const state_none = 0;
const state_begin_draw = 1;

cc.Class({
    extends: cc.Component,
    name:"drawTabMgr",
    properties: {
        drawCamera: cc.Camera,
        drawNode: cc.Node,

        demoCamera: cc.Camera,
        demoTip: cc.Node,
        demoSpr: cc.Sprite,

        drawSpr: cc.Sprite,
        drawHint:cc.Sprite,

        pens: cc.Node,
        penItem: cc.Node,
        btnLayer: cc.Node,

        guide: cc.Node,
        handguide:cc.Node,   //手型
        pen: cc.Sprite,
        progressnode:cc.Node,    //进度条
        goNextBtn:cc.Node,       //下一步
    },

    init(data){
        this.game    = data.game;
        this.gameID  = data.id;
        this.isOver  = data.complete;
        this._state = state_none;
        this.drawMgr = this.drawNode.getComponent('drawMgr');
        this.drawMgr.init(this.game);

        this.initView();
        this.addEvent();
    },

    addEvent(){
        cc.vv.eventMgr.on(cc.vv.eventName.close_drawColor_guide, this.hideGuide, this);
        cc.vv.eventMgr.on(cc.vv.eventName.game_go_home, this.game_go_home, this);

        this.drawSpr.node.on('touchstart', this.touchstart, this);
        this.drawSpr.node.on('touchmove', this.touchmove, this);
        this.drawSpr.node.on('touchend', this.touchend, this);
        this.drawSpr.node.on('touchcancel', this.touchcancel, this);
    },

    onDestroy(){
        cc.vv.eventMgr.off(cc.vv.eventName.close_drawColor_guide, this.hideGuide, this);
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    touchstart(evt){
        let p = evt.getLocation();
        let p_1 = this.drawSpr.node.convertToNodeSpaceAR(p);
        this.pen.node.active = true;
        this.pen.node.setPosition(p_1);
        /*
        if(this.progressnode.active) {
            this.progressnode.position = p_1;
        }
        */
        this.progress().then(()=>{
            this._state = state_begin_draw;
        })
        /*
        let p = evt.getLocation();
        let p_1 = this.drawSpr.node.convertToNodeSpaceAR(p);
        p_1.x += 21;
        p_1.y += 63;
        // let pp  = this.scaleBtn.convertToWorldSpaceAR(cc.v2(0,0));
        this.pen.node.active = true;
        this.pen.node.setPosition(p_1);
        cc.vv.audioMgr.playEffect('spray');
        */
    },

    progress() {
        return new Promise((resolved,rejected)=>{
            this.progressnode.active = true;
            let procom = this.progressnode.getComponent(cc.ProgressBar);
            procom.progress = 0;
            let slot = setInterval(()=>{
                procom.progress = procom.progress + 0.03;
                if (procom.progress >=1) {
                    clearInterval(slot);
                    ///this.progressnode.active = false;
                    resolved(true);
                }
            },30)
        })
    },

    touchmove(evt){
    
        let p = evt.getLocation();
        let p_1 = this.drawSpr.node.convertToNodeSpaceAR(p);
       

        p_1.x += 21;
        p_1.y += 63;
        this.pen.node.setPosition(p_1);
    
    },
    touchend(evt){
        this._state = state_none;
        this.pen.node.active = false;
        cc.vv.audioMgr.stopEffect('spray');
    },

    touchcancel(evt){
        this.pen.node.active = false;
        cc.vv.audioMgr.stopEffect('spray');

    },

    game_go_home(){
        let data = this.drawMgr.getData();
        cc.vv.gameMgr.setDrawData(data);
    },
    canMove() {
        return this._state == state_begin_draw;
    },
    clear(){
        if(this.penArr && this.penArr.length){
            this.penArr.forEach(item => {
                item.parent = null;
                item.destroy();
            })
        }
        this.drawPixels   = 0;//用户画出来的Array
        this.drawBgPixels = 0;//显示的纯白色衣服背景的像素点 用来规避画到透明区域
        this.demoPixels   = 0;//衣服样式 参考和判分用的array
        this.isShowDemo   = false;
        this.selectPen    = null;
        this.penArr       = []; //装逼的
        this.demoSpr.spriteFrame = null;
        this.drawSpr.spriteFrame = frame;
        cc.vv.eventMgr.off(cc.vv.eventName.game_go_home, this.game_go_home, this);
    },

    initView(){
        this.showDemo();
        this.showDemoWhite();
        this.showDemoHint();
        this.setUtilsView();
        this.initCutorSkin();
    },

    initCutorSkin(){
        if(cc.vv.skinMgr.try_UsePenInfo){
            let info = cc.vv.skinMgr.try_UsePenInfo;
            this.pen.spriteFrame = cc.vv.pensSkin[info.skin_try_icon];
        }else{
            let info = cc.vv.skinMgr.usePenInfo;
            this.pen.spriteFrame = cc.vv.pensSkin[info.skin_try_icon];
        }
        this.pen.node.active = false;
    },

    setUtilsView(){
        // if(!this.isOver){
            this.btnLayer.active = true;
            this.initPenList();
        // }else{
        //     this.pens.active     = false;
        //     this.btnLayer.active = false;
        // }
    },

    showDemo(){
        if(!this.demoSpr.spriteFrame){
            let texture = cc.vv.clothesDemo;
            if(!texture){
                Log.catch('in drawTabMgr 87',cc.vv.clothesDemo);
                return;
            }
           
            let rt = new cc.RenderTexture();
            rt.initWithSize(texture.width, texture.height);
            rt.drawTextureAt(texture, 0, 0);
            this.demoCamera.targetTexture = rt;
            this.demoCamera.render();
            let data = this.demoPixels = rt.readPixels();
            Log.d(data);
            let img = new cc.Texture2D();
            img.initWithData(data, 16, texture.width, texture.height);
            this.demoSpr.spriteFrame = new cc.SpriteFrame(img);
            this.scheduleOnce(()=>{
                this.demoTip.y = cc.winSize.height / 2;
                let offset     = this.demoTip.y - this.demoTip.height + 60
                this.demoTip.runAction(
                    cc.moveTo(0.5,this.demoTip.x,offset).easing(cc.easeBackOut())
                )
            },0.018)
        }
    },

    showDemoWhite(){
        //mask只起到辅助作用可以不要 drawPixels 是参考背景 防止给透明区域染色
        if(!this.drawSpr.spriteFrame){
            let texture = cc.vv.clothesDemoWhite;
            if(!texture){
                Log.catch('in drawTabMgr 111', cc.vv.clothesDemoWhite);
                return;
            }
            console.log("showDemoWhite",cc.vv.clothesDemoWhite);

            let frame = new cc.SpriteFrame(texture);
            let rt = new cc.RenderTexture();
            rt.initWithSize(texture.width, texture.height);
            rt.drawTextureAt(texture, 0, 0);
            this.drawCamera.targetTexture = rt;
            this.drawCamera.render();
            this.drawBgPixels = rt.readPixels();
            this.drawSpr.spriteFrame = frame;
            // this.scheduleOnce(this.initDrawMgr,0);
            this.initDrawMgr();
        }
    },

    showDemoHint() {
        if(!this.drawHint.spriteFrame) {
            let texture = cc.vv.clothesDemoHint;
            if (!texture) {
                Log.catch("in drawTabMgr showDemoHint",cc.vv.clothesDemoHint);
                return;
            }
            let frame = new cc.SpriteFrame(texture);
            this.drawHint.spriteFrame = frame;
        }
    },
    initDrawMgr(){
        let node = this.drawSpr.node;
        let data = cc.vv.gameMgr.getDrawData();
        this.drawMgr.initModel(node,this.drawBgPixels,data);
    },
    
    initPenList(){
        if(this.penArr && this.penArr.length){return}
        if(!cc.vv.clothesConfig){return}
        let pensColor = cc.vv.clothesConfig.color;
        let colors    = pensColor.split(',');
        this.penArr = [];
        this.check_selected_pen_list = [];
        for(let i = 0; i < colors.length; i++){
            let item  = cc.instantiate(this.penItem);
            let color = colors[i];
            item.getComponent(cc.Sprite).spriteFrame = cc.vv.pensAsset[color];
            item.id   = i.toString();
            item.color_hex = '#'+color;
            item.parent = this.pens;
            item.active = true;
            this.penArr.push(item);
        }
        this.selectPenCallBack({target: this.penArr[0]});
        this.showGuide(1);
    },

    //选择橡皮
    selectEraser(){
        this.drawMgr.setDrawUtils(
            drawConfig.eraser 
        )
        this.layDownPen();
    },

    //选择一个笔 不包括橡皮
    selectPenCallBack(evt){
        if(this.selectPen){
            if (evt.target.id == this.selectPen.id) {
                return;
            }
            this.layDownPen();
        }
        this.selectPen = evt.target;
        let hex = this.selectPen.color_hex;
        let color = new cc.Color().fromHEX(hex);
        this.drawMgr.setDrawUtils(
            drawConfig.circlePen, 
            new cc.Color(color.getR(), color.getG(), color.getB(), 255)
        )
        this.takeUpPen();

        this.checkSelectAllPen();
    },
    checkSelectAllPen() {
        let find = false;
        for (let i=0;i<this.check_selected_pen_list.length;i++) {
            let check = this.check_selected_pen_list[i]
            if(check == this.selectPen) {
                find = true;
            }
        }
        if (!find) {
            this.check_selected_pen_list.push(this.selectPen);
            if(this.check_selected_pen_list.length == this.penArr.length) {
                setTimeout(() => {
                    this.showHandGuild();            
                }, 3000);
            }
        }
    },

    takeUpPen(){
        if(this.selectPen){
            this.selectPen.y = 10;
            this.selectPen.setScale(cc.v2(1.1,1.1));
        }
    },

    layDownPen(){
        if(this.selectPen){
            this.selectPen.y = 0;
            this.selectPen.setScale(cc.v2(1,1));
            this.selectPen = null;
        }
    },

    //撤销
    withdraw(){
        if(this.drawMgr){this.drawMgr.withdraw();}
    },

    //算分
    toNextGame(){
        cc.vv.eventMgr.emit(cc.vv.eventName.complete_one_game,this.gameID);
        cc.vv.userMgr.setUserGudie('4');
    },

    result(){
        //this.isOver = true;
        //cc.vv.eventMgr.emit(cc.vv.eventName.complete_one_game,this.gameID);
        //this.setUtilsView();
        //关闭触摸
        //this.drawMgr.closeDrawNodeTouch();
    },

    setResultData(){
        Log.d('判分...请勿打扰...');
        let demoPixelsObj = {};
        this.tailorDemoTo16(demoPixelsObj);
        let drawPixelsObj = {};
        this.tailorDrawTo16(drawPixelsObj);

        let new_calculate = new calculate('x');
        let result = new_calculate.toCompare(demoPixelsObj,drawPixelsObj);
        let score  = new_calculate.getScore(result);
        let sp = this.drawMgr.getDrawSpr();
        let texture = sp.spriteFrame.clone();
        let frame   = texture;//new cc.SpriteFrame(texture);
        cc.vv.gameMgr.setPerformDrawData({
            frame: frame,
            score: score
        });
    },

    //目前先不采用裁图再计算 虽然直观但只是修改了纹理 并没有修改图片实例
    tailorDemoTo16(obj, index){
        if(!index){index = 0}
        if(!obj[index]) {obj[index] = []};
        let len   = this.demoSpr.node.width * 40;
        let start = index * len * 4;
        let key   = start;
        for(let i = 0; i < len; i++){
            let r = this.demoPixels[key];
            let g = this.demoPixels[key+1];
            let b = this.demoPixels[key+2];
            let a = this.demoPixels[key+3];
            key += 4;
            if(key >= this.demoPixels.length){
                return;
            }
            obj[index].push(utils.convertToRuleOut(r,g,b,a))
        }
        this.tailorDemoTo16(obj, ++index);
    },

    tailorDrawTo16(obj, index){
        if(!index){index = 0}
        if(!obj[index]) {obj[index] = []};

        if(!this.drawPixels){
            let sp = this.drawMgr.getDrawSpr();
            this.drawSprWidth  = sp.node.width;
            this.drawPixels    = this.drawMgr.getData();
        }
        let len   = this.drawSprWidth * 40;
        let start = index * len * 4;
        let key   = start;
        for(let i = 0; i < len; i++){
            let r = this.drawPixels[key];
            let g = this.drawPixels[key+1];
            let b = this.drawPixels[key+2];
            let a = this.drawPixels[key+3];

            //如果衣服本身有背景色的画 就给返回背景色 _d
            let _r = this.drawBgPixels[key];
            let _g = this.drawBgPixels[key+1];
            let _b = this.drawBgPixels[key+2];
            let _a = this.drawBgPixels[key+3];
            let d = utils.convertToRuleOut(_r,_g,_b,_a);
            key+=4;
            if(key >= this.drawPixels.length){
                return;
            }
            obj[index].push(utils.convertToRuleIn(r,g,b,a,d))
        }
        this.tailorDrawTo16(obj, ++index)
    },


    //判分逻辑 裁图裁成16张
    //先裁图 再去递归循环可能会好一点 也可能没啥用
    // tailorDemoTo16(demo_16, tailorIndex){
    //     if(!tailorIndex){tailorIndex = 0;}
    //     if(demo_16.length >= 16){return demo_16;}

    //     let demo   = this.demoSpr.spriteFrame.getTexture().clone();
    //     let width  = parseInt(demo.getRect().width  / 4);
    //     let height = parseInt(demo.getRect().height / 4);
    //     let y = Math.floor(tailorIndex / 4) * height;
    //     let x = (tailorIndex % 4) * width;
    //     let tmpRect = new cc.Rect(x,y,width,height);
    //     demo.setRect(tmpRect);
    //     this.testArr1[tailorIndex].spriteFrame = demo;
    //     tailorIndex ++;
    //     demo_16.push(demo);
    //     this.tailorDemoTo16(demo_16, tailorIndex);
    // },

    // tailorDrawTo16(demo_16, tailorIndex){
    //     if(!tailorIndex){tailorIndex = 0;}
    //     if(demo_16.length >= 16){return demo_16;}

    //     let spr    = this.drawMgr.getDrawSpr();
    //     let demo   = spr.spriteFrame.clone();
    //     let width  = parseInt(demo.getRect().width  / 4);
    //     let height = parseInt(demo.getRect().height / 4);
    //     let y = Math.floor(tailorIndex / 4) * height;
    //     let x = (tailorIndex % 4) * width;
    //     let tmpRect = new cc.Rect(x,y,width,height);
    //     demo.setRect(tmpRect);
    //     this.testArr1[tailorIndex].spriteFrame = demo;
    //     tailorIndex ++;
    //     demo_16.push(demo);
    //     this.tailorDrawTo16(demo_16, tailorIndex);
    // },

    //判卷
    // panjuan(arr,idx,arrEnd){
    //     if(!arr.length){return null}
    //     if(!idx){idx = 0}
    //     if(!arr[idx]){return}
    //     let rt = new cc.RenderTexture();
    //     let _texture = arr[idx];
    //     let texture = _texture.getTexture();
    //     rt.initWithSize(texture.width,texture.height);
    //     rt.drawTextureAt(texture, 0, 0);
    //     this.drawCamera.targetTexture = rt;
    //     this.drawCamera.render();
    //     let data = rt.readPixels();
    // },

    showGuide(index){
        if(cc.vv.userInfo.guide && cc.vv.userInfo.guide['1']){
            return;
        }
        if(index == 1){
            this.guide.active = true;
        }
    },

    hideGuide(){
        this.guide.active = false;
        cc.vv.userMgr.setUserGudie('1');
    },

    showHandGuild() {
        if(cc.vv.userInfo.guide && cc.vv.userInfo.guide['4']) {
            return 
        } else {
            this.handguide.active = true;
        }
    }
})