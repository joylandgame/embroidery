cc.Class({
    extends: cc.Component,

    properties: {
        str: cc.Label
    },

    show(data){
        this.str.string = data;
        this.node.active = true;
        this.node.stopAllActions();
        this.node.scale = 0;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.3, 1),
            cc.delayTime(0.8),
            cc.scaleTo(0.3,0),
            cc.callFunc(()=>{
                this.node.active = false;
            },this)
        ))
    },
});
