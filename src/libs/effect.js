// 点效果集合 父类
class Effect {
    viewer;
    id;
    duration;
    maxRadius;
    pointDraged;
    leftDownFlag;
    update_position;
    constructor(viewer, id, maxRadius, duration) {
        this.viewer = viewer
        this.id = id
        this.duration = duration
        this.maxRadius = maxRadius
        this.pointDraged = null
        this.leftDownFlag = false;


    }
    del() {
        this.viewer.entities.removeById(this.id)
    }
}

function calShaderXY(firstAngle, secondAngle) {
    // 计算当前纹理的x和y数值,套算法
    let a = firstAngle, b = secondAngle, PI = Math.PI, x, y;
    // console.log('a-' , a);
    // console.log('b-' , b);
    if (a > -PI / 2 && a <= 0) {
        if (b > -PI / 2 && b <= 0) {
            x = 0;
            y = 0
        } else if (b > 0 && b <= PI / 2) {
            x = 0;
            y = Math.sin(b) / (Math.sin(b) - Math.sin(a))
        } else if (b > PI / 2 && b <= PI) {
            x = 0;
            y = Math.sin(b) / (Math.sin(b) - Math.sin(a))
        }
    } else if (a > -PI && a <= -PI / 2) {
        if (b > -PI / 2 && b <= 0) {
            x = -Math.cos(a) / (Math.cos(b) - Math.cos(a));
            y = 0;
        } else if (b > 0 && b <= PI / 2) {
            x = -Math.cos(a) / (Math.cos(b) - Math.cos(a));
            y = Math.sin(b) / (1 + Math.sin(b));
        } else if (b > -PI && b <= -PI / 2) {
            x = 1;
            y = 0;
        }
    } else if (a > -3 * PI / 2 && a <= -PI) {
        if (b > -PI && b <= -PI / 2) {
            x = 1;
            y = Math.sin(a) / (Math.sin(a) - Math.sin(b))
        } 
        else if (b > -PI / 2 && b <= 0) {
            x = 1 / (1 + Math.cos(b));
            y = Math.sin(a) / (1 + Math.sin(a))
        }
    } else if (a > 0 && a <= PI / 2) {
        if (b > 0 && b <= PI / 2) {
            x = 0;
            y = 1;
        } else if (b > PI / 2 && b <= PI) {
            x = -Math.cos(b) / (Math.cos(a) - Math.cos(b));
            y = 1
        } else if(b > PI && b <= 3* PI /2){
            x = 1 / (Math.cos(a) + 1);
            y = 1 / (1 - Math.sin(b))
        }
    } else if (a > PI / 2 && a <= PI){
        if (b > PI / 2 && b <= PI) {
            x = 1;
            y = 1;
        } else if (b > PI && b <= 3 * PI / 2) {
            x = 1;
            y = Math.sin(a) / (Math.sin(a) - Math.sin(b))
        }
    } else {
        throw('未定义该角度算法')
    }
    //#region 
    // 如果a < 0 && b < 0，则a和b都加2 * PI
    // if(a < 0 && b < 0){
    //     a += 2 * PI;
    //     b += 2 * PI;
    //     let tmp = a;
    //     a = b;
    //     b = tmp;
    // }
    // if (a >= 0 && a <= PI / 2) {
    //     if (b >= 0 && b <= PI / 2) {
    //         x = 0;
    //         y = 0;
    //     } else if (b > PI / 2 && b <= PI) {
    //         x = -Math.cos(b) / (Math.cos(a) - Math.cos(b));
    //         y = 0;
    //     } else if (b > PI && b <= (3 * PI / 2)) {
    //         x = 1 / (1 + Math.cos(a));
    //         y = Math.cos((3 * PI / 2) - b) / (1 + Math.cos((3 * PI / 2) - b));
    //     } else if (b > (3 * PI / 2) && b <= 2 * PI) {
    //         if (a + b <= 2 * PI) {
    //             x = 1 / (1 + Math.cos(a));
    //             y = .5;
    //         } else {
    //             x = 1 / (1 + Math.cos(b));
    //             y = .5;
    //         }
    //     }
    // } else if (a > PI / 2 && a <= PI) {
    //     if (b > PI / 2 && b <= PI) {
    //         x = 1;
    //         y = 0;
    //     } else if (b > PI && b <= 3 * PI / 2) {
    //         x = 1;
    //         y = -Math.sin(b) / (Math.sin(a) - Math.sin(b))
    //     } else if (b > 3 * PI / 2 && b <= 2 * PI) {
    //         x = 1 / (1 + Math.cos(b));
    //         y = 1 / (1 + Math.sin(a));
    //     }
    // } else if (a > PI && a <= 3 * PI / 2) {
    //     if (b > PI && b <= 3 * PI / 2) {
    //         x = 1;
    //         y = 1;
    //     } else if (b > 3 * PI / 2 && b <= 2 * PI) {
    //         x = -Math.cos(a) / (Math.cos(b) - Math.cos(a));
    //         y = 1;
    //     }
    // } else if ((a > 3 * PI / 2 && a <= 2 * PI) && (b > 3 * PI / 2 && b <= 2 * PI)) {
    //     x = 0;
    //     y = 1
    // }

    // // 如果a < 0 && b > 0
    // if(a < 0 && b > 0){
    //     if(a > -PI / 2){
    //         if(b <= PI /2){
    //             x = 0;
    //             y = -Math.sin(a) / (Math.sin(b) - Math.sin(a));
    //         } else if(b > PI / 2 && b <= PI){
    //             x = -Math.cos(b) / (1 - Math.cos(b));
    //             y = -Math.sin(a) / (Math.sin(b) - Math.sin(a))
    //         }
    //     } else if(a > -PI && a <= -PI / 2){
    //         if(b > 0 && b <= PI / 2){
    //             x = -Math.cos(a) / (1 - Math.cos(a));
    //             y = 1 / (1 + Math.sin(b))
    //         }
    //     }
    // }
    //#endregion
    return {
        x,
        y
    }
}
// 水波纹相关材质
function CircleWaveMaterialProperty(ob) {
    this._definitionChanged = new Cesium.Event()
    this._color = undefined
    this._colorSubscription = undefined
    this.color = ob.color
    this.duration = Cesium.defaultValue(ob.duration, 1000)
    this.count = Cesium.defaultValue(ob.count, 2)
    if (this.count <= 0) {
        this.count = 1
    }
    this.gradient = Cesium.defaultValue(ob.gradient, 0.1)
    if (this.gradient === 0) {
        this.gradient = 0
    }
    if (this.gradient > 1) {
        this.gradient = 1
    }
    this._time = new Date().getTime()
}
Object.defineProperties(CircleWaveMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false
        },
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged
        },
    },
    color: Cesium.createPropertyDescriptor('color'),
    duration: Cesium.createPropertyDescriptor('duration'),
    count: Cesium.createPropertyDescriptor('count'),
    shaderX: Cesium.createPropertyDescriptor('shaderX'),
    shaderY: Cesium.createPropertyDescriptor('shaderY')
})
CircleWaveMaterialProperty.prototype.getType = function (_time) {
    return Cesium.Material.CircleWaveMaterialType
}
CircleWaveMaterialProperty.prototype.getValue = function (
    time,
    result
) {
    if (!Cesium.defined(result)) {
        result = {}
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        Cesium.Color.WHITE,
        result.color
    )
    result.time =
        ((new Date().getTime() - this._time) % this.duration) / this.duration
    result.count = this.count
    result.gradient = 1 + 10 * (1 - this.gradient)
    // 根据当前传递的起始和终止角计算纹理的x和y数值
    let shaderCenter = calShaderXY(Number(this.firstAngle) * Math.PI / 180, Number(this.secondAngle) * Math.PI / 180);
    result.shaderX = shaderCenter.x;
    result.shaderY = shaderCenter.y;
    return result
}
CircleWaveMaterialProperty.prototype.equals = function (other) {
    const reData = (
        this === other ||
        (other instanceof CircleWaveMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
    )
    return reData
}
Cesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty
Cesium.Material.CircleWaveMaterialType = 'CircleWaveMaterial'
Cesium.Material.CircleWaveSource = `
                                    czm_material czm_getMaterial(czm_materialInput materialInput) {
                                      czm_material material = czm_getDefaultMaterial(materialInput);
                                      material.diffuse = 1.5 * color.rgb;
                                      vec2 st = materialInput.st;
                                      vec3 str = materialInput.str;
                                      float dis = distance(st, vec2(shaderX, shaderY));
                                      float per = fract(time);
                                      if (abs(str.z) > 0.001) {
                                        discard;
                                      }
                                      if (dis > 1.0) {
                                        discard;
                                      } else {
                                        float perDis = 1.0 / count;
                                        float disNum;
                                        float bl = .0;
                                        for (int i = 0; i <= 9; i++) {
                                          if (float(i) <= count) {
                                            disNum = perDis *float(i) - dis + per / count;
                                            if (disNum > 0.0) {
                                              if (disNum < perDis) {
                                                bl = 1.0 - disNum / perDis;
                                              } 
                                              material.alpha = pow(bl, gradient);
                                            }
                                          }
                                        }
                                      }
                                      return material;
                                    }
                                    `
Cesium.Material._materialCache.addMaterial(
    Cesium.Material.CircleWaveMaterialType, {
    fabric: {
        type: Cesium.Material.CircleWaveMaterialType,
        uniforms: {
            color: new Cesium.Color(1, 1, 0, 1),
            time: 1,
            count: 1,
            gradient: 0.1,
            shaderX: 0.6,
            shaderY: 0
        },
        source: Cesium.Material.CircleWaveSource
    },
    translucent: function () {
        return true
    },
}
)