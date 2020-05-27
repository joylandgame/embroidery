cc.Class({
    extends: cc.Component,

    properties: {
        buyerSpr: [cc.SpriteFrame],
        nowTime: cc.Label,
        headIcon: cc.Sprite,
        
        price: cc.Label,
        highestPrice: cc.Label,

        nextBtn: cc.Node,
        saleBtn: cc.Node,
        highestBtn: cc.Node,

        paiMai: cc.Node,
        result: cc.Node,

        mask: cc.Mask,
        di: cc.Sprite,
        add: cc.Label,
        jiage: cc.Label,
        zuizhong: cc.Label,
        draw: cc.Sprite,
        cixiu: cc.Sprite

    },

    init(game,price,scoreRatio){
        this.game = game;
        this.nextBtn.active = true;
        this.saleBtn.active = true;
        this.highestBtn.active = false;
        this.basePrice  = price;
        this.scoreRatio = scoreRatio;
        this.nextBtn.x  =  150;
        this.saleBtn.x  = -150;
        this.buyerIndex = 0;
        this._highestPrice = 0;
        this._price = 0;
        this.initView();
        this.paiMai.active = true;
        this.result.active = false;
    },

    initView(){
        this.headIcon.spriteFrame = this.buyerSpr[this.buyerIndex];
        let _random = Math.random() < 0.4 ? - Math.random()*0.2 : Math.random()*0.2;
        let price   = Math.ceil(this.basePrice*this.scoreRatio);
        price = _random * price + price;
        price = Math.ceil(cc.vv.userInfo.bonus * price + price);
        this.price.string = this._price = price;
        if(price>this._highestPrice){this._highestPrice = price}
        this.highestPrice.string = '目前最高销售价格为:'+this._highestPrice;
        this.nowTime.string = String(this.buyerIndex + 1);
        if(this.buyerIndex == 2){
            this.nextBtn.active = false;
            // this.highestBtn.active = this._highestPrice > this._price;
            // this.saleBtn.x = this._highestPrice <= this._price ? 0 : this.saleBtn.x;
            this.saleBtn.x = 0;
        }
    },

    nextBtnCall(){
        this.buyerIndex+=1;
        this.initView();
        cc.vv.audioMgr.playEffect('change');
    },

    saleBtnCall(){
        //cc.vv.userMgr.addUserGold(this._price);
        //this.game.readyGoNext();
        //this.node.active = false;
        cc.vv.audioMgr.playEffect('sell');
        this.showResuleView();
    },

    highestBtnCall(){
        this._price = this._highestPrice ? this._highestPrice : this._price;
        //cc.vv.userMgr.addUserGold(this._price);
        //this.game.readyGoNext();
        //this.node.active = false;
        cc.vv.audioMgr.playEffect('sell');
        this.showResuleView();
    },

    showResuleView(){

        let drawData = cc.vv.gameMgr.getPerformDrawData();
        let embroideryData = cc.vv.gameMgr.getPerformEmbroideryData();
        let data = cc.vv.gameMgr.getPutEmbroideryData();
        this.mask.spriteFrame  = new cc.SpriteFrame(cc.vv.clothesDemoWhite);
        this.mask.node.width   = cc.vv.clothesDemoWhite.width;
        this.mask.node.height  = cc.vv.clothesDemoWhite.height;
        this.di.spriteFrame    = new cc.SpriteFrame(cc.vv.clothesDemoWhite);
        this.draw.spriteFrame  = drawData.frame;
        if(embroideryData){
            this.cixiu.spriteFrame = embroideryData.frame;
            this.cixiu.node.x = data.putX;
            this.cixiu.node.y = data.putY;
            this.cixiu.node.scale = data.putScale;
            this.cixiu.node.angle = data.putAngle;
        }


        this.jiage.string    = String(Math.ceil(this.basePrice*this.scoreRatio)); 
        this.zuizhong.string = String(this._price);
        this.add.string      = String(cc.vv.userInfo.bonus);

        this.paiMai.active = false;
        this.result.active = true;

    },

    noBtnCall(){
        cc.vv.userMgr.addUserGold(this._price);
        this.game.readyGoNext();
        this.node.active = false;
    },

    getDoubleCall(){
        this.doubleCall = (type)=>{
            if(type != 1){
                return
            }
            cc.vv.userMgr.addUserGold(this._price*2);
            cc.vv.audioMgr.playEffect('sell');
            this.game.readyGoNext();
            this.node.active = false;
        }
        this.doubleCall(1); //bind后 传入到广告回调
    }
})