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
    },

    init(game,price,scoreRatio){
        this.game = game;
        this.nextBtn.active = true;
        this.saleBtn.active = true;
        this.basePrice  = price;
        this.scoreRatio = scoreRatio;
        this.nextBtn.x  =  150;
        this.saleBtn.x  = -150;
        this.buyerIndex = 0;
        this._highestPrice = 0;
        this._price = 0;
        this.initView();
    },

    initView(){
        if(this.buyerIndex == 2){
            this.nextBtn.active = false;
            this.saleBtn.x      = 0;
        }
        this.headIcon.spriteFrame = this.buyerSpr[this.buyerIndex];
        let _random = Math.random() < 0.4 ? - Math.random()*0.2 : Math.random()*0.2;
        let price   = this.basePrice*this.scoreRatio;
        price = _random * price + price;
        price = Math.ceil(cc.vv.userInfo.bonus * price + price);
        this.price.string = this._price = price;
        if(price>this._highestPrice){this._highestPrice = price}
        this.highestPrice.string = '目前最高销售价格为:'+this._highestPrice;
        this.nowTime.string = String(this.buyerIndex + 1);
    },

    nextBtnCall(){
        this.buyerIndex+=1;
        this.initView();
    },

    saleBtnCall(){
        cc.vv.userMgr.setUserGold(cc.vv.userInfo.gold + this._price);
        this.game.readyGoNext();
        this.node.active = false;
    }
})