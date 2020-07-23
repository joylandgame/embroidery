// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        item: cc.Node,
        bg: cc.Node,
        content: cc.Node,

        btn: cc.Node

    },

    init(){
        if(!cc.vv.mutual_push.list){return}
        this.list = this.list || cc.vv.mutual_push.list;
        //this.startX = (cc.winSize.width / 2 - 70);
        this.startX = 110;
        this.endX   = this.node.position.x;
        console.log("winsize=======start,x",this.startX,this.endX,cc.winSize,this.bg.width);

        if(!this.itemArr){
            this.itemArr = [];
            for(let i = 0; i < this.list.length; i++){
                let info = this.list[i];
                if(!info){continue}
                let item = cc.instantiate(this.item);
                item.apk = info.apk;
                let name = item.getChildByName('name').getComponent(cc.Label);
                let icon = item.getChildByName('icon').getComponent(cc.Sprite);
                let logo = item.getChildByName('logo').getComponent(cc.Sprite);
                name.string = info.name;
                cc.vv.utils.loadSpriteFrameByHttp(info.icon, icon);
                item.parent = this.content;
                this.itemArr.push(item);
                item.active = true;
            }
        }
        this.openState = 0; //0关  1开
        this.changeBtnSpr();
      
        this.node.active = true;
        this.openOrClose();
    },

    changeBtnSpr(){
        if(this.openState == 0){
            this.btn.setScale(cc.v2(-1,1));
        }else{
            this.btn.setScale(cc.v2(1,1));
        }
    },

    openOrClose(){
        console.log("openOrClose======",this.openState)
        switch(this.openState){
            case 0:
                this.node.stopAllActions();
                this.openState = 1;
                this.changeBtnSpr();
                this.node.runAction(cc.moveTo(0.5, this.endX, this.node.y));
            break;

            case 1:
                this.node.stopAllActions();
                this.openState = 0;
                this.changeBtnSpr();
                this.node.runAction(cc.moveTo(0.5, this.startX, this.node.y));

            break;
        }
        this.changeBtnSpr();
    },
    itemCallBack(evt){
        if(evt.target.apk) {
            let name = evt.target.apk;
            cc.vv.jsbMgr.openGame(name);
        }
    },

});
