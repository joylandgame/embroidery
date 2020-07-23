// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const item_height = 193;
cc.Class({
    extends: cc.Component,

    properties: {
        scroll_layer: cc.ScrollView,
        content: cc.Node,

        item: cc.Node,
        nextbtn:cc.Node,
    },

    init(){
        if(!cc.vv.size_grid){
            this.node.active = false;
            return;
        }

        this.list = this.list || cc.vv.size_grid.list;
        if(!this.list.length){
            this.node.active = false;
            return;
        }
        let allItem_number = 0;
        if(!this.itemArr){
            this.itemArr = [];
            for(let i = 0; i < this.list.length; i++){
                let info = this.list[i];
                if(!info){continue}
                allItem_number++;
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

        this.contentHeight = (()=>{
            let line = Math.ceil(allItem_number / 3) - 1;
            return item_height * line;
        })();

        this.dir = '';
        this.node.active = true;
        this.nextbtn.active = false;
        setTimeout(()=>{
            this.nextbtn.active = true;
        },2000)
    },

    runToTop(dis){
        if(this.dir == 'to_top'){return};
        this.dir = 'to_top';
        this.unscheduleAllCallbacks();
        this.toTop = this.scheduleOnce(()=>{
            this.scroll_layer.scrollTo(cc.v2(0, 1), dis / 40, false);
        }, 2.0)
    },

    runToBottom(dis){
        if(this.dir == 'to_bottom'){return};
        this.dir  = 'to_bottom';
        this.unscheduleAllCallbacks();
        this.toBottom = this.scheduleOnce(()=>{
            this.scroll_layer.scrollTo(cc.v2(0, 0), dis / 40,false);
        }, 2.0)
    },

    itemCallBack(evt){
        if(evt.target.apk) {
            let name = evt.target.apk;
            cc.vv.jsbMgr.openGame(name);
        }
    },

    close(){
        this.node.active = false;
    },

    update(){
        if(this.scroll_layer.isScrolling()){
            this.scroll_layer.stopAutoScroll();
            this.dir = '';
            this.unscheduleAllCallbacks();
            return;
        }
        
        let offSet = this.scroll_layer.getScrollOffset();
        let maxOffSet = this.scroll_layer.getMaxScrollOffset();
        let maxY = Math.round(maxOffSet.y);
        let offY = Math.round(offSet.y);
        if(offY == 0){
            this.runToBottom(maxY);
            return
        }
        if(offY == maxY){
            this.runToTop(maxY);
            return
        }
        if(offY <= maxY / 2 && this.dir == ''){
            this.runToBottom(maxY - offY);
        }
        if(offY > maxY / 2  && this.dir == ''){
            this.runToTop(maxY - offY);
        }
    },
    nextGame() {
        this.close();
        cc.vv.eventMgr.emit(cc.vv.eventName.next_game);
    }
});
