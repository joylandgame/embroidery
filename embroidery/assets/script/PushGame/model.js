export class MutualPush {

    constructor (){
        this.id = 0
        this.des = ''
        this.list = []
    }
    
    getList() {
        return [].concat(this.list);
    }
}



export class SizeGrid {
    constructor (){
        this.id = 0
        this.des = ''
        this.list = []
    }
}

export class MinGameModel {
    constructor (){
        this.name = ''
        this.apk = ''
        this.icon = ''
    }
}

export class WheelPlanting {

    constructor(){
        this.id = 0;
        this.des= '';
        this.list=[];
        this.times=[];
    }

    copyFrom(m) {
        this.id = m.id;
        this.des = m.des;
        this.list = [].concat(m.list);
        this.times = [].concat(m.times);
    }
    
    getList() {
        return [].concat(this.list);
    }
}