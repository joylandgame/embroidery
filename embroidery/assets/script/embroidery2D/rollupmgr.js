var id = 1;
var rollupmgr = {
    init() {
        this._action_list = [];
        this._cur_action = null;
        
	return this;
    },

    addPinkAction(tilecom) {
        if(this._cur_action ==null) {
            this._cur_action = {
                _type:1,
                _id:id++,
                _com_list:[],
            }
        }
        this._cur_action._com_list.push(tilecom);
    },

    addEraseAction(tilecom) {
        if(this._cur_action ==null) {
            this._cur_action = {
                _type:2,
                _id:id++,
                _com_list:[],
            }
        }

        this._cur_action._com_list.push(tilecom);
    },
    
    clearCurAction() {
        if(this._cur_action) {
            this._action_list.push(this._cur_action)
        }
        this._cur_action = null;
    },

    rollup() {
        if(this._action_list.length <= 0) {
            return false;
            
        }
        let last = this._action_list[this._action_list.length -1];
        this._rollup(last);
        this._action_list.length = this._action_list.length -1;
        return true;
    },

    _rollup(action) {
        if(action._type ==1) {
            //回退绘画
            for(let i=0;i<action._com_list.length;i++) {
                let com = action._com_list[i]
                if(com) {
                    com.rollup_pink();
                }
            }
        } else if(action._type ==2) {
            //回退清楚
            for(let i=0;i<action._com_list.length;i++) {
                let com = action._com_list[i]
                if(com) {
                    com.rollup_erase();
                }
            }
        }
    }
}

export default rollupmgr.init();
