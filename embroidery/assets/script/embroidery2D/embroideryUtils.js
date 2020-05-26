var utils = {
    //根据渲染到纹理数据spriteFrame
    convertRenderToSpriteFrame(renderTexture) {
         let data = renderTexture.readPixels();
         let width = renderTexture.width
         let height = renderTexture.height
         return this.convertDataToSpriteFrame(data,width,height);
    },
    //根据二进制data生成spriteFrame
    convertDataToSpriteFrame(data,width,height) {
        
        return new Promise((resolved,rejected)=>{
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext('2d');
            let rowBytes = width * 4; 
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1);
                let start = srow * width * 4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = data[start + i];
                }
    
                ctx.putImageData(imageData, 0, row);
            }

            let dataURL = canvas.toDataURL("image/png");
            let img = document.createElement("img");
            img.src = dataURL;
            img.onload = ()=>{
                let texture = new cc.Texture2D();
                texture.initWithElement(img);
              
                let spriteFrame = new cc.SpriteFrame();
                spriteFrame.setTexture(texture);
                resolved(spriteFrame)
            }
        })
        
    },
}

export default utils;