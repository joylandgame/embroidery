const eventName = {
    //系统事件
    system_signin_over : 'system_signin_over', //累计签到完成

    //注册事件
    complete_one_game: 'complete_one_game',//玩家完成一项页签
    complete_all_game: 'complete_all_game',//玩家完成所有页签

    //游戏结算
    game_settle_accounts: 'game_settle_accounts', 

    //返回主界面
    game_go_home: 'game_go_home',

    //关闭上色引导
    close_drawColor_guide: 'close_drawColor_guide',
    //关闭摆位置引导
    close_moveScale_guide: 'close_moveScale_guide',

    //需要切的条为空
    clear_tailor_list:'clear_tailor_list',


    
    push_game_tip_1_open : 'push_game_tip_1_open',
    push_game_tip_1_close: 'push_game_tip_1_close',//关闭game推送（九宫格）
    push_game_tip_2_open : 'push_game_tip_2_open',
    push_game_tip_2_close : 'push_game_tip_2_close',
    next_game: "next_game",
    last_game_done:"last_game_don",
}

export default eventName;