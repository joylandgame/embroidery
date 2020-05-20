
//自己写个二维坐标sxy
class Vec2 {
    constructor(x, y) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }
    set(p, y) {
        if (typeof p === "number") {
            this.x = p;
            this.y = y;
        } else {
            this.x = p.x;
            this.y = p.y;
        }
    }
}

//虚线的配置
var IMAGINARY = {
    scope: 100,     //像素单位 范围
    //虚线范围内的取随机值 0.5的概率上色 未上色的部分标记为遗漏下次再随机的时候直接给上色
    colourRandom: 0.5,
}

var drawUint8Array = {
    _witdh: 0,
    _height: 0,

    buffer: 0,
    pixelColor: 0,
    curColor: 0,

    drawPixels: [], //参考背景

    /**临时存储的颜色值 */
    tempColor: 0,
    tempR: 0,
    tempG: 0,
    tempB: 0,
    tempA: 0,
    previousLineCircleEnd: false,//线段终点是不是个圆

    //*********************外部调用**************************
    init(width, height, drawPixels) {
        this.tempColor = this.tempR = this.tempG = this.tempB = this.tempA = 0;
        this.curColor = 0;
        this._width = Math.round(width);
        this._height = Math.round(height);
        // this.initPointColor();
        this.initPixelColor();
        this.initLineData();
        this.drawPixels = drawPixels;
    },

    resetPointColor() {
        for (let x = this.width - 1; x >= 0; --x) {
            for (let y = this.height - 1; y >= 0; --y) {
                this.pointColor[x][y] = 0;
            }
        }
    },

    //reset如果传入一个值 视为set
    reset(data) {
        if (data) {
            this.setData(data);
            return;
        }
        // this.resetPointColor();
        this.pixelColor.fill(0);
    },

    /**
     * 传入图像的像素数据，直接设置画板的内容，图像尺寸必须与画板一致
     *///(重新设置画板大小init())
    setData(data /*ArrayBuffer*/) {
        let pixelData = new Uint8Array(data);
        if (pixelData.length != this._width * this._height * 4) {
            console.warn("画板设置数据失败，数据长度与画板大小不一致。");
            return;
        }
        this.setPixelColorByRGBA(pixelData);
        // this.setPointColorByRGBA(pixelData);
    },

    //修改pointcolor
    setPointColorByRGBA(data) {
        for (let y = 0; y < this._height; y) {
            let i = y * this._height;
            for (let x = 0; x < this._width; ++x) {
                let color = this.convertToNumber(data[i], data[i+1], data[i+2], data[i+3])
                this.pointColor[x][y] = color;
                i+=4;
            }
        }
    },


    /**
     * 获取画板中的数据
     *  data 用于接收数据的数组
     */
    copyData(data) {
        if (undefined === data) {
            data = [];
        }
        for (let i = 0, count = this.pixelColor.length; i < count; ++i) {
            data[i] = this.pixelColor[i];
        }
        return data;
    },

    //获取画板中记录每个像素
    getData() {
        return this.pixelColor; //Uint8Array格式
    },

    /**获取画板内部使用的内存块*/
    getBuffer() {
        return this.buffer; //Uint8Array格式
    },

    //重置
    clear() {
        this.reset();
    },

    /**
 * 移动画笔到指定的位置，调用 lineTo 函数时将使用该点作为直线的起点
 *  x     坐标X
 *  y     坐标Y
 */
    moveTo(x, y) {
        x = Math.round(x);
        y = Math.round(y);
        this.previousLineEndPos.set(x, y);
        this.previousLineEndPosT.set(x, y);
        this.previousLineEndPosB.set(x, y);
    },

    setColor(r, g, b, a) {
        this.curColor = this.convertToNumber(r, g, b, a);
        this.tempColor = this.curColor;
        this.tempR = r;
        this.tempG = g;
        this.tempB = b;
        this.tempA = a;
    },
    /**
     * 设置线宽
     */
    setLineWidth(w) {
        this.previousLineWidth = w;
    },

    /**
     * 绘制直线，使用默认的颜色、线宽和线段端点样式
     */
    line(x1, y1, x2, y2) {
        x1 = Math.round(x1);
        x2 = Math.round(x2);
        y1 = Math.round(y1);
        y2 = Math.round(y2);
        if (x1 == x2 && y1 == y2) return;
        let width = this.previousLineWidth;
        let circleEnd = this.previousLineCircleEnd;
        this.previousLineEndPos.set(x2, y2);
        let offsetX = 0;
        let offsetY = 0;
        let rateK = 1;
        if (x1 == x2) {
            offsetX = Math.round(width * 0.5);
        } else if (y1 == y2) {
            offsetY = Math.round(width * 0.5);
        } else {
            let k = (y2 - y1) / (x2 - x1);
            rateK = Math.sqrt(k * k + 1);
            offsetY = width * 0.5 / rateK;
            offsetX = Math.round(offsetY * k);
            offsetY = Math.round(offsetY);
        }
        this.previousLineEndPosT.set(x2 - offsetX, y2 + offsetY);
        this.previousLineEndPosB.set(x2 + offsetX, y2 - offsetY);

        let p1 = new Vec2(x1, y1);
        let p2 = new Vec2(x2, y2);
        if (x1 > x2) {
            p1.x = x2;
            p1.y = y2;
            p2.x = x1;
            p2.y = y1;
        }
        this._drawLine(p1, p2, width, offsetX, offsetY, rateK);
        if (circleEnd) {
            this._drawCircle(x1, y1, width * 0.5);
            this._drawCircle(x2, y2, width * 0.5);
        }
    },

    lineTo(x, y) {
        x = Math.round(x);
        y = Math.round(y);
        if (this.previousLineEndPos.x == x && this.previousLineEndPos.y == y) return;
        let width = this.previousLineWidth;
        let circleEnd = this.previousLineCircleEnd;
        let x1 = this.previousLineEndPos.x;
        let y1 = this.previousLineEndPos.y;
        let x2 = x;
        let y2 = y;
        if (x1 > x2) {
            x1 = x2;
            y1 = y2;
            x2 = this.previousLineEndPos.x;
            y2 = this.previousLineEndPos.y;
        }
        let offsetX = 0;
        let offsetY = 0;
        let rateK = 1;
        if (x1 == x2) {
            offsetX = Math.round(width * 0.5);
        } else if (y1 == y2) {
            offsetY = Math.round(width * 0.5);
        } else {
            let k = (y2 - y1) / (x2 - x1);
            rateK = Math.sqrt(k * k + 1);
            offsetY = width * 0.5 / rateK;
            offsetX = Math.round(offsetY * k);
            offsetY = Math.round(offsetY);
        }
        if (!circleEnd) {
            if (this.previousLineEndPos.x != this.previousLineEndPosT.x
                || this.previousLineEndPos.y != this.previousLineEndPosT.y) {
                let p1 = new Vec2(this.previousLineEndPos.x - offsetX, this.previousLineEndPos.y + offsetY);
                let p2 = new Vec2(this.previousLineEndPos.x + offsetX, this.previousLineEndPos.y - offsetY);
                this._drawTriangle([p1, p2, this.previousLineEndPosT]);
                this._drawTriangle([p1, p2, this.previousLineEndPosB]);
            }
        } else {
            this._drawCircle(x1, y1, width * 0.5);
            this._drawCircle(x2, y2, width * 0.5);
        }
        this._drawLine(new Vec2(x1, y1), new Vec2(x2, y2), width, offsetX, offsetY, rateK);

        this.previousLineEndPos.set(x, y);
        this.previousLineEndPosT.set(x - offsetX, y + offsetY);
        this.previousLineEndPosB.set(x + offsetX, y - offsetY);
    },

    /**
     * 绘制矩形
     */
    rect(x, y, w, h) {
        this._drawRect(new Vec2(x, y), w, h);
    },

    /**
    *绘制一个圆
    */
    circle(x, y, radius) {
        x = Math.round(x);
        y = Math.round(y);
        this._drawCircle(x, y, radius);
    },

    /**
     * 绘制三角形
     * x1    顶点1坐标X
     * y1    顶点1坐标Y
     * x2    顶点2坐标X
     * y2    顶点2坐标Y
     * x3    顶点3坐标X
     * y3    顶点3坐标Y
     */
    triangle(x1, y1, x2, y2, x3, y3) {
        let pList = [];
        pList.push(new Vec2(x1, y1));
        pList.push(new Vec2(x2, y2));
        pList.push(new Vec2(x3, y3));
        this._drawTriangle(pList);
    },




    //*************************本身调用************************** */

    initLineData() {
        this.previousLineEndPos = new Vec2();
        this.previousLineEndPosT = new Vec2();
        this.previousLineEndPosB = new Vec2();
        this.previousLineCircleEnd = false;
        this.previousLineWidth = 1;
    },

    initPixelColor() {
        this.buffer = new ArrayBuffer(this._width * this._height * 4);
        this.pixelColor = new Uint8Array(this.buffer);
        this.pixelColor.fill(0);
    },

    // initPointColor() {
    //     if (!this.pointColor) {
    //         this.pointColor = [];
    //     }
    //     for (let x = 0; x < this._width; ++x) {
    //         if (!this.pointColor[x]) {
    //             this.pointColor[x] = [];
    //         }
    //         for (let y = 0; y < this._height; ++y) {
    //             this.pointColor[x][y] = 0;
    //         }
    //     }
    // },

    /**
     * 记录各像素颜色分量
     */
    setPixelColorByRGBA(data) {
        this.pixelColor.set(data); //Uint8Array
    },


    /**
     * 绘制直线，不包含线段端点样式
     */
    _drawLine(p1, p2, width, offsetX, offsetY, slopeRate) {
        if (p1.y == p2.y) {
            //水平直线
            let x = p1.x < p2.x ? p1.x : p2.x;
            this._drawRect(new Vec2(x, Math.round(p1.y - width * 0.5)), Math.abs(p1.x - p2.x), width);
        } else if (p1.x == p2.x) {
            //垂直直线
            let y = p1.y < p2.y ? p1.y : p2.y;
            this._drawRect(new Vec2(Math.round(p1.x - width * 0.5), y), width, Math.abs(p1.y - p2.y));
        } else {
            //倾斜直线
            let inverseK = (p1.x - p2.x) / (p1.y - p2.y);
            let p1t = new Vec2(p1.x - offsetX, p1.y + offsetY);
            let p1b = new Vec2(p1.x + offsetX, p1.y - offsetY);
            let p2t = new Vec2(p2.x - offsetX, p2.y + offsetY);
            let p2b = new Vec2(p2.x + offsetX, p2.y - offsetY);
            let p1c = new Vec2();
            let p2c = new Vec2();
            let height = Math.round(width * slopeRate);
            if (p2.y > p1.y) {
                if (p1b.x < p2t.x) {
                    p1c.x = p1b.x;
                    p1c.y = p1b.y + height;
                    p2c.x = p2t.x;
                    p2c.y = p2t.y - height;
                    this._drawVerticalTriangle(p1c, p1b, p1t);
                    this._drawParallelogram(p1b, p2c, height);
                    this._drawVerticalTriangle(p2t, p2c, p2b);
                } else {
                    p1c.x = p1b.x;
                    p1c.y = Math.round(p2t.y - (p1c.x - p2t.x) * inverseK);
                    p2c.x = p2t.x;
                    p2c.y = Math.round(p1b.y + (p1b.x - p2c.x) * inverseK);
                    this._drawVerticalTriangle(p2t, p2c, p1t);
                    this._drawParallelogram(p2c, p1b, p2t.y - p2c.y);
                    this._drawVerticalTriangle(p1c, p1b, p2b);
                }
            } else {
                if (p1t.x < p2b.x) {
                    p1c.x = p1t.x;
                    p1c.y = p1t.y - height;
                    p2c.x = p2b.x;
                    p2c.y = p2b.y + height;
                    this._drawVerticalTriangle(p1t, p1c, p1b);
                    this._drawParallelogram(p1c, p2b, height);
                    this._drawVerticalTriangle(p2c, p2b, p2t);
                } else {
                    p1c.x = p1t.x;
                    p1c.y = Math.round(p2b.y - (p1c.x - p2b.x) * inverseK);
                    p2c.x = p2b.x;
                    p2c.y = Math.round(p1t.y + (p1t.x - p2c.x) * inverseK);
                    this._drawVerticalTriangle(p2c, p2b, p1b);
                    this._drawParallelogram(p2b, p1c, p1t.y - p1c.y);
                    this._drawVerticalTriangle(p1t, p1c, p2t);
                }
            }
        }
    },

    /**
     * 绘制矩形
     */
    _drawRect(p, w, h) {
        let minX = this.clampX(p.x);
        let maxX = this.clampX(p.x + w);
        let minY = this.clampY(p.y);
        let maxY = this.clampY(p.y + h);
        for (let y = minY; y <= maxY; ++y) {
            this._drawRowPixel(minX, maxX, y);
        }
    },

    /**
     * 绘制平行四边形，平行四边形的左右两边与Y轴平行
     */
    _drawParallelogram(p1, p2, height) {
        if (p1.x == p2.x) return;
        let k = (p2.y - p1.y) / (p2.x - p1.x);
        let minX = this._minX(p1.x);
        let maxX = this._maxX(p2.x);
        for (let x = minX; x <= maxX; ++x) {
            let minY = p1.y + Math.round((x - p1.x) * k);
            let maxY = minY + height;
            minY = this._minY(minY);
            maxY = this._maxY(maxY);
            this._drawColPixel(minY, maxY, x);
        }
    },

    /**
     * 绘制三角形
     */
    _drawTriangle(pList) {
        pList.sort((a, b) => {
            return a.x - b.x;
        });
        let p1 = pList[0];
        let p2 = pList[1];
        let p3 = pList[2];
        if (p1.x == p2.x) {
            if (p1.x == p3.x) return;
            if (p1.y < p2.y) {
                p1 = pList[1];
                p2 = pList[0];
            }
            this._drawVerticalTriangle(p1, p2, p3);
            return;
        }
        let k = (p3.y - p1.y) / (p3.x - p1.x);
        let p4 = new Vec2(p2.x, Math.round(p1.y + (p2.x - p1.x) * k));
        if (p4.y == p2.y) return;
        if (p4.y < p2.y) {
            this._drawVerticalTriangle(p2, p4, p1);
            this._drawVerticalTriangle(p2, p4, p3);
        } else {
            this._drawVerticalTriangle(p4, p2, p1);
            this._drawVerticalTriangle(p4, p2, p3);
        }
    },

    /**
    * 绘制一条边与Y轴平行的三角形
    */
    _drawVerticalTriangle(p1, p2, p3) {
        if (p3.x == p1.x) return;
        let k1 = (p3.y - p1.y) / (p3.x - p1.x);
        let k2 = (p3.y - p2.y) / (p3.x - p2.x);
        let maxX = p3.x, minX = p1.x;
        if (maxX < minX) {
            maxX = p1.x;
            minX = p3.x;
        }
        minX = this._minX(minX);
        maxX = this._maxX(maxX);
        for (let x = minX; x <= maxX; ++x) {
            let maxY = this.clampY(Math.round(p1.y + (x - p1.x) * k1));
            let minY = this.clampY(Math.round(p2.y + (x - p2.x) * k2));
            this._drawColPixel(minY, maxY, x);
        }
    },

    _drawCircle(x, y, radius) {
        radius = Math.round(radius);
        if (radius == 0) return;
        let dis = radius * radius;
        let minY = this.clampY(y - radius);
        let maxY = this.clampY(y + radius);
        for (let j = minY; j <= maxY; ++j) {
            let r = j - y;
            r = Math.round(Math.sqrt(dis - r * r));
            let minX = this.clampX(x - r);
            let maxX = this.clampX(x + r);
            this._drawRowPixel(minX, maxX, j);
        }
    },

    //比较啊
    _minX(x) { return x >= 0 ? x : 0; },
    _maxX(x) { return x < this._width ? x : this._width - 1; },
    _minY(y) { return y >= 0 ? y : 0; },
    _maxY(y) { return y < this._height ? y : this._height - 1; },
    clampX(x) {
        if (x < 0) { return 0 };
        if (x >= this._width) { return this._width - 1 };
        return x;
    },
    clampY(y) {
        if (y < 0) { return 0; }
        if (y >= this._height) { return this._height - 1; }
        return y;
    },


    /**绘制一个像素点的颜色 */
    // _drawPixel(x, y) {
    // },

    /**
     * 连续绘制一行中的像素点
     */
    _drawRowPixel(startX, endX, y) {
        let index = (y * this._width + startX) * 4;
        for (let x = startX; x <= endX; ++x) {
            // if (this.pointColor[x][y] != this.tempColor) {
                if (this.drawPixels[index + 3] == 0) { return }
                this.pixelColor[index] = this.tempR;
                this.pixelColor[index + 1] = this.tempG;
                this.pixelColor[index + 2] = this.tempB;
                this.pixelColor[index + 3] = this.tempA;
            //     this.pointColor[x][y] = this.tempColor;
            // }
            index += 4;
        }
    },
    /**
     * 连续绘制一列中的像素点
     */
    _drawColPixel(startY, endY, x) {
        let index = (startY * this._width + x) * 4;
        for (let y = startY; y <= endY; ++y) {
            // if (this.pointColor[x][y] != this.tempColor) {
                if (this.drawPixels[index + 3] == 0) { return }
                this.pixelColor[index] = this.tempR;
                this.pixelColor[index + 1] = this.tempG;
                this.pixelColor[index + 2] = this.tempB;
                this.pixelColor[index + 3] = this.tempA;
            //     this.pointColor[x][y] = this.tempColor;
            // }
            index += this._width * 4;
        }
    },


    /**
     * 将RGBA颜色分量转换为一个数值表示的颜色，颜色分量为0~255之间的值
     */
    convertToNumber(r, g, b, a) {
        let _a = typeof a == 'undefined' ? 255 : a;
        return ((r & 0xfe) << 23) | (g << 16) | (b << 8) | _a;
    },

}

export default drawUint8Array;