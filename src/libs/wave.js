/** 
 * @description: 借助html生成圆形波
 * @param: 根据项目需求自行添加
 * 
*/
class Wave {
    // 构造函数，初始化相关信息
    constructor(opts) {
        this._viewer = opts.viewer;
        this._id = opts.id;
        this._angle = opts.angle;
        this._followEntity = opts.entity;
        this._color = opts.color; // 颜色
        // 朝向
        this._firstAngle = opts.heading - (opts.angle) / 2; // 第一个角度
        this._secondAngle = opts.heading + (opts.angle) / 2 ; // 第二个角度
        console.log(this);
        this._count = Number(opts.count); // 波纹个数
        this._radius = opts.radius; // 扇形半径

        // 借助画布交替变化
        this._changeNum = 0; // 初始数值0
        this._curCanvas = opts.id + '-a';

        // document创建三个canvas元素
        this.canvasA = document.createElement('canvas')
        this.canvasA.id = this._id + '-a';
        this.canvasA.width = 400;
        this.canvasA.height = 400;
        // this.canvasA.style.display = 'none';
        document.body.append(this.canvasA)

        this.canvasB = document.createElement('canvas')
        this.canvasB.id = this._id + '-b';
        this.canvasB.width = 400;
        this.canvasB.height = 400;
        // this.canvasB.style.display = 'none';
        document.body.append(this.canvasB)

        this.canvasC = document.createElement('canvas')
        this.canvasC.id = this._id + '-c';
        this.canvasC.width = 400;
        this.canvasC.height = 400;
        // this.canvasC.style.display = 'none';
        document.body.append(this.canvasC)

        // 调用创建画板函数
        this.readyCanvas(this.canvasA.id, 10);
        this.readyCanvas(this.canvasB.id, 15);
        this.readyCanvas(this.canvasC.id, 20);
    }
    changeColorRgba(opacity) {
        // 将十六进制数据转为rgba形式
        let reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
        if (!reg.test(this._color)) { return; }
        let newColor = (this._color.toLowerCase()).replace(/\#/g, '')
        let len = newColor.length;
        if (len == 3) {
            let t = ''
            for (let i = 0; i < len; i++) {
                t += newColor.slice(i, i + 1).concat(newColor.slice(i, i + 1))
            }
            newColor = t
        }
        let arr = []; //将字符串分隔，两个两个的分隔
        for (let i = 0; i < 6; i = i + 2) {
            let s = newColor.slice(i, i + 2)
            arr.push(parseInt("0x" + s))
        }
        return 'rgba(' + arr.join(",") + "," + opacity + ')';
    }
    readyCanvas(currCanvsId, radius) {
        let canvas = document.getElementById(currCanvsId);
        let cwidth = 400,
            cheight = 400,
            ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, cwidth, cheight);
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, cwidth, cheight);

        for (let ii = 0; radius <= 200; ii++) {
            ctx.lineWidth = 6;
            // //开始一个新的绘制路径
            ctx.beginPath();
            // //设置弧线的颜色
            let opacity = 1.0 - (radius / 255);
            ctx.strokeStyle = this.changeColorRgba(opacity);
            let circle = {
                x: 200, //圆心的x轴坐标值
                y: 200, //圆心的y轴坐标值
                r: radius //圆的半径
            };
            ctx.arc(circle.x, circle.y, circle.r, this._firstAngle * Math.PI / 360, this._secondAngle * Math.PI / 360, false);
            // //按照指定的路径绘制弧线
            ctx.stroke();
            radius += 200 / Number(this._count);
        }
    }

    add() {
        const _this = this;
        this._viewer.entities.add({
            id: this._id,
            name: "波形电波效果",
            position: new Cesium.CallbackProperty((time) => {
                if (_this._followEntity.position.getValue(time)) {
                    // 计算当前实体的朝向
                    let orientation = Cesium.HeadingPitchRoll.fromQuaternion(_this._followEntity.orientation.getValue(time)),
                        heading = Cesium.Math.toDegrees(orientation.heading);
                    // 朝向
                    _this._firstAngle = Number(heading) - Number(_this._angle) / 2 - 270; // 第一个角度
                    _this._secondAngle = Number(heading) + Number(_this._angle) / 2 - 270; // 第二个角度
                    // 调用创建画板函数
                    _this.readyCanvas(_this.canvasA.id, 10);
                    _this.readyCanvas(_this.canvasB.id, 15);
                    _this.readyCanvas(_this.canvasC.id, 20);
                    return _this._followEntity.position.getValue(time)
                }
            }, false),
            ellipse: {
                semiMajorAxis: this._radius,
                semiMinorAxis: this._radius,
                material: new Cesium.ImageMaterialProperty({
                    image: new Cesium.CallbackProperty(() => {
                        _this._changeNum++;
                        if (_this._changeNum >= 10) {
                            _this._changeNum = 0;
                            if (_this._curCanvas == _this.canvasA.id)
                                _this._curCanvas = _this.canvasB.id;
                            else if (_this._curCanvas == _this.canvasB.id)
                                _this._curCanvas = _this.canvasC.id;
                            else
                                _this._curCanvas = _this.canvasA.id;
                        }
                        return document.getElementById(_this._curCanvas)
                    }, false),
                    transparent: true
                }),
                height: 8000
            }
        });
    }
}