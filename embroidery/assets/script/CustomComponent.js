cc.Class({
    extends: cc.Component,
    properties: {
        _canvas : null,
        points : {
            default : [],
            type : cc.Vec2,
        },

    },
    
    onLoad(){
        this._canvas = cc.find('Canvas');
        
        this._canvas.on('mouseup',(e)=>{
            let location = e.getLocation();
            let isContain = this.check(location);
            cc.log(isContain);
        },this);
    },
    
    check(location){
        let node = this.node;
        let pointInNode = node.convertToNodeSpaceAR(location);
        if(pointInNode.x < -node.width/2 || pointInNode.x > node.width/2 || pointInNode.y > node.height/2 || pointInNode.y < -node.height/2){
            return false;
        }
        
        let i, j, c = false;
        
        let nvert = this.points.length;
        let testx = pointInNode.x;
        let testy = pointInNode.y;
        let vert = this.points;
        
        for(i = 0, j = nvert - 1; i < nvert; j = i++){
            if ( ( (vert[i].y > testy) != (vert[j].y > testy) ) && 
                ( testx < ( vert[j].x - vert[i].x ) * ( testy - vert[i].y ) / ( vert[j].y - vert[i].y ) + vert[i].x ) ) 
                c = !c; 
        } 
        
        return c; 
    }
});
