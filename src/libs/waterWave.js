
/**
 * // let circleWave = new CircleWave(
//     viewer,
//     "circleWave",
//     '#1FA8E3',
//     10,
//     100,
//     100,
//     pointEntity,
//     new Cesium.TimeIntervalCollection([
//         new Cesium.TimeInterval({
//             start: start,
//             stop: stop,
//         }),
//     ]),
//     8
// );
 */
class CircleWave extends Effect {
    count;
    list = [];

    // 构造函数
    constructor(
        viewer,
        id,
        color,
        radius,
        heading,
        angle,
        followEntity,
        timeLine,
        count
    ) {
        super(viewer, id, Number(radius) * 1000, 3000);
        // 初始化当前实体的相关信息，将数据转为合适的类型
        this._viewer = viewer;
        this._id = id; // 效果id
        this._color = color; // 颜色
        this._maxRadius = Number(radius) * 1000; // 波纹半径
        this._heading = Number(heading);  // 朝向
        this._angle = Number(angle); // 夹角
        this._followEntity = followEntity; // 跟随实体
        this._timeLine = timeLine; // 绑定时间轴
        this._count = Number(count); // 波纹个数
        this._duration = 3000; // 持续时间


        // 计算当前实体的最大和最小夹角
        this.getMinMaxAngle();
        // 调用当前创建实体
        this.add();
    }
    // 计算当前实体的最小/大夹角
    getMinMaxAngle() {
        this._firstAngle = this._heading - this._angle / 2
        this._secondAngle = this._heading + this._angle / 2
    }
    // 将C3转为经纬度
    Cartesian3ToWGS84(point) {
        let c3 = new Cesium.Cartesian3(point.x, point.y, point.z);
        let cartographic = Cesium.Cartographic.fromCartesian(c3);
        let lon = Number(Cesium.Math.toDegrees(cartographic.longitude));
        let lat = Number(Cesium.Math.toDegrees(cartographic.latitude));
        let alt = Number(cartographic.height);
        return {
            lon: lon,
            lat: lat,
            alt: alt
        };
    }
    // 绘制扇形
    /**
         * @description 画扇形（从正北开始顺时针旋转）
         * @param {Number} angleFirst 扇形第一个边的角度
         * @param {Number} angleSecond 扇形第二个边的角度
         * @param {Cartosian} center 中心点位置 lon, lat, alt
         * @param {Number} radius 扇形半径
         */
    drawSector = (opts) => {
        let {
            angleFirst,
            angleSecond,
            center,
            radius
        } = opts, list = [];
        list.push(Number(center.lon))
        list.push(Number(center.lat))
        for (let i = angleFirst; i <= angleSecond; i += 1) {
            let point = this.calculatingTargetPoints(
                center.lon,
                center.lat,
                Number(center.alt),
                i * (Math.PI / 180),
                radius
            );
            list.push(point.lon);
            list.push(point.lat);
        }
        list.push(Number(center.lon));
        list.push(Number(center.lat));
        return list;
    }
    /**
     * @description 已知初始位置、距離以及角度，計算目標位置
     * @param {int} lon 中心点经度
     * @param {*} lat 中心点纬度
     * @param {*} height 中心点高度
     * @param {*} direction 方向
     * @param {*} radius 半径
     */
    calculatingTargetPoints = (lon, lat, height, direction, radius) => {
        // 观察点
        let viewPoint = Cesium.Cartesian3.fromDegrees(lon, lat, height);
        // 世界坐标转换为投影坐标
        let webMercatorProjection = new Cesium.WebMercatorProjection(this._viewer.scene.globe.ellipsoid);
        let viewPointWebMercator = webMercatorProjection.project(Cesium.Cartographic.fromCartesian(viewPoint));
        // 计算目标点
        let toPoint = new Cesium.Cartesian3(
            viewPointWebMercator.x + radius * Math.cos(-direction),
            viewPointWebMercator.y + radius * Math.sin(-direction),
            0);
        // 投影坐标转世界坐标
        toPoint = webMercatorProjection.unproject(toPoint);
        toPoint = Cesium.Cartographic.toCartesian(toPoint.clone());
        // 世界坐标转地理坐标
        let cartographic = Cesium.Cartographic.fromCartesian(toPoint);
        return {
            lon: Cesium.Math.toDegrees(cartographic.longitude),
            lat: Cesium.Math.toDegrees(cartographic.latitude)
        };
    }
    add() {
        this._viewer.entities.add({
            id: this._id,
            // 绑定事件
            availability: this._timeLine,
            position: this._followEntity.position,
            polygon: {
                hierarchy: new Cesium.CallbackProperty((time) => {
                    // 实时创建多边形实体
                    if (this._followEntity.position.getValue(time)) {
                        let position_tmp = this.Cartesian3ToWGS84(this._followEntity.position.getValue(time));
                        // 实时根据朝向计算polygon的绘制数据信息
                        let follow_mtx3 = Cesium.Matrix3.fromQuaternion(this._followEntity.orientation.getValue(time)),
                        follow_mtx4 = Cesium.Matrix4.fromRotationTranslation(follow_mtx3, this._followEntity.position.getValue(time), new Cesium.Matrix4()),
                        follow_hpr = Cesium.Transforms.fixedFrameToHeadingPitchRoll(follow_mtx4, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.HeadingPitchRoll());
                        
                        this._heading = Cesium.Math.toDegrees(follow_hpr.heading); // 当前实体的朝向角度
                        
                        this.getMinMaxAngle();
                        // 绘制新的多边形
                        let points = this.drawSector({
                            angleFirst: this._firstAngle,
                            angleSecond: this._secondAngle,
                            center: {
                                lon: Number(position_tmp.lon),
                                lat: Number(position_tmp.lat),
                                alt: Number(position_tmp.alt)
                            },
                            radius: this._maxRadius
                        })

                        this._viewer.entities.getById(this._id).polygon.height = Number(position_tmp.alt);
                        // 更新材质角度
                        this._viewer.entities.getById(this._id).polygon.material.firstAngle = this._firstAngle;
                        this._viewer.entities.getById(this._id).polygon.material.secondAngle = this._secondAngle;

                        // PolygonHierarchy 定义多边形及其孔的线性环的层次结构（空间坐标数组）
                        return new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(points));
                    }
                }, false),
                material: new Cesium.CircleWaveMaterialProperty({
                    duration: this._duration,
                    gradient: 0,
                    color: new Cesium.Color.fromCssColorString(this._color),
                    count: this._count,
                    firstAngle: this._firstAngle,
                    secondAngle: this._secondAngle
                }),
                height: -1, // 将当前实体高度设为无效数值 -1
                outline: false, // 默认不显示边框
                outlineColor: new Cesium.Color.fromCssColorString(this._color)
            },
        })
    }
}