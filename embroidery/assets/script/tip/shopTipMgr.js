// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const viewType = {
    scissor: 0,
    pen    : 1,
    needle : 2,
}

cc.Class({
    extends: cc.Component,

    properties: {
        pen_item: cc.Node,
        scissor_item: cc.Node,
        needle_item: cc.Node,

        penView: cc.Node,
        penContent: cc.Node,

        scissorView: cc.Node,
        scissorContent: cc.Node,

        needleView: cc.Node,
        needleContent: cc.Node,

        numbers: cc.SpriteAtlas,
    },

    // scissorKey : '1',
    // penKey     : '2',
    // needleKey  : '3',

    // {
    //     "type": "皮肤类型：1剪刀 2笔刷 3刺针",
    //     "id": "唯一标识",
    //     "name": "皮肤名字",
    //     "skin_res_name": "皮肤对应的资源名称",
    //     "unlock_type": "解锁条件：0默认解锁，1金币手动兑换，2签到解锁，3视频解锁",
    //     "unlock_need": "解锁要消耗的数量",
    //     "skin_try_icon": "皮肤试用界面的icon",
    //     "skin_try_weight": "试用皮肤随机权重"
    // },
    init(){
        this.openView = viewType.scissor;

        if(!this.scissorsArr){
            let scissorsInfo = cc.vv.skinMgr.getSkinsInfo(cc.vv.skinMgr.scissorKey);
            for(let i = 0; i < scissorsInfo.length; i++){
                let item = cc.instantiate(this.scissor_item);
                let icon = item.getChildByName('icon').getComponent(cc.Sprite);
                let buyBtn = item.getChildByName('buyBtn');
                let videoBtn = item.getChildByName('videoBtn');
                let signinBtn = item.getChildByName('signinBtn');
                let useBtn = item.getChildByName('useBtn');
                let have = item.getChildByName('have');
                let useing = item.getChildByName('useing');
                cc.vv.userInfo.useScissor;
            }
        }

        if(!this.pensArr){

        }
    }

});
