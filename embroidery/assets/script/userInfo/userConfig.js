var userConfig = {
    id: '0',
    level: 1,
    gold: 0,

    openBgm: 'true',
    openEffect: 'true',
    openVibration: 'true',

    clothesID: '', //用户当前衣服如果没有就随机一个 clothes
    mapID    : '', //用户当前的刺绣map

    bonus: 25, //收益加成
    upgradeLv: 1,

    guide: '', //{"0": '', "1": '', "2": '', "3": ''}

    usePen: '',    //用着的笔 id
    useNeedle: '', //针
    useScissor: '',//剪子

    userPens: [],
    userNeedles: [],
    userScissors: [],
}
export default userConfig;