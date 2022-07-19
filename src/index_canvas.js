// 创建半球雷达
import * as forceEffect from "./libs/trackMatte.js"
// 挂载cesium到window.viewer
let viewer = new Cesium.Viewer('cesium-container', {
    shouldAnimate: false,
    animation: true, //是否创建动画小器件，左下角仪表
    baseLayerPicker: true, //是否显示图层选择器
    fullscreenButton: false, //是否显示全屏按钮
    geocoder: false, //是否显示geocoder小器件，右上角查询按钮
    homeButton: false, //是否显示Home按钮
    infoBox: false, //是否显示信息框
    selectionIndicator: true, //是否显示选取指示器组件
    timeline: true, //是否显示时间轴
    sceneMode: Cesium.SceneMode
        .SCENE3D, //设定3维地图的默认场景模式:Cesium.SceneMode.SCENE2D、Cesium.SceneMode.SCENE3D、Cesium.SceneMode.MORPHING
    navigationHelpButton: false, //是否显示右上角的帮助按钮
    scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    navigationInstructionsInitiallyVisible: false,
    showRenderLoopErrors: true, //是否显示渲染错误
});
let imageryProviderViewModels = viewer.baseLayerPicker.viewModel.imageryProviderViewModels;
viewer.baseLayerPicker.viewModel.selectedImagery = imageryProviderViewModels[imageryProviderViewModels.length -
    1];
// viewer.extend(Cesium.viewerCesiumNavigationMixin);
// // //取消双击事件
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
//开启深度检测
viewer.scene.globe.depthTestAgainstTerrain = true;

// 创建时间轴
let start = Cesium.JulianDate.fromDate(new Date());
let stop = Cesium.JulianDate.addSeconds(
    start,
    360,
    new Cesium.JulianDate()
);
// 绑定时间轴
viewer.clock.startTime = start.clone()
viewer.clock.currentTime = start.clone();
// 设置时钟结束时间
viewer.clock.stopTime = stop.clone();
viewer.clock.multiplier = 2;
//#region 
// let circleWave = new CircleWave(viewer, "circleWave");
// circleWave.add([113.940, 22.512, 10000], '#1FA8E3', 100, 3000, true, new Cesium.TimeIntervalCollection([
//     new Cesium.TimeInterval({
//         start: start,
//         stop: stop,
//     }),
// ]));
// let circleWave1 = new CircleWave(viewer, "circleWave1");
// circleWave1.add([113.940, 22.512, 10000], '#3F8AE3', 100, 3000, true, new Cesium.TimeIntervalCollection([
//     new Cesium.TimeInterval({
//         start: start,
//         stop: stop,
//     }),
// ]));
//#endregion

// 随着位置修改波纹位置
// 添加附着实体
function computeCirclularFlight(lon, lat, radius) {
    var property = new Cesium.SampledPositionProperty();
    for (var i = 0; i <= 360; i += 45) {
        var radians = Cesium.Math.toRadians(i);
        var time = Cesium.JulianDate.addSeconds(
            start,
            i,
            new Cesium.JulianDate()
        );
        var position = Cesium.Cartesian3.fromDegrees(
            lon + (radius * 1.5 * Math.cos(radians)),
            lat + (radius * Math.sin(radians)),
            8000
        );

        property.addSample(time, position);

        let e = viewer.entities.add({
            position: position,
            point: {
                pixelSize: 8,
                color: Cesium.Color.TRANSPARENT,
                outlineColor: Cesium.Color.YELLOW,
                outlineWidth: 3,
            },
        });
    }
    return property;
}
var position = computeCirclularFlight(113.940, 22.512, 0.03);
let pointEntity = viewer.entities.add({
    id: "point",
    availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
            start: start,
            stop: stop,
        }),
    ]),
    position: position,
    // orientation: new Cesium.HeadingPitchRoll(
    //     Cesium.Math.toRadians(30),
    //     Cesium.Math.toRadians(20),
    //     Cesium.Math.toRadians(10)),
    orientation: new Cesium.VelocityOrientationProperty(position),
    model: {
        uri: './air.glb', // 模型路径
        minimumPixelSize: 64,
    },
    billboard: { //图标
        image: './layer-border.png',
        width: 100,
        height: 46,
        pixelOffset: new Cesium.Cartesian2(100, -35), //偏移量
    },
})
pointEntity.position.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
})
pointEntity.path = {
    resolution: 1,
    material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.1,
        color: Cesium.Color.RED
    }),
    width: 10
}
//#region 
// function Cartesian3ToWGS84(point) {
//     let c3 = new Cesium.Cartesian3(point.x, point.y, point.z);
//     let cartographic = Cesium.Cartographic.fromCartesian(c3);
//     let lon = Number(Cesium.Math.toDegrees(cartographic.longitude));
//     let lat = Number(Cesium.Math.toDegrees(cartographic.latitude));
//     let alt = Number(cartographic.height);
//     return {
//         lon: lon,
//         lat: lat,
//         alt: alt
//     };
// }
// // 绘制扇形
// /**
//  * @description 画扇形（从正北开始顺时针旋转）
//  * @param {Number} angleFirst 扇形第一个边的角度
//  * @param {Number} angleSecond 扇形第二个边的角度
//  * @param {Cartosian} center 中心点位置 lon, lat, alt
//  * @param {Number} radius 扇形半径
//  */
// function drawSector(opts) {
//     let {
//         angleFirst,
//         angleSecond,
//         center,
//         radius
//     } = opts, list = [];
//     list.push(Number(center.lon))
//     list.push(Number(center.lat))
//     for (let i = angleFirst; i < angleSecond; i += 1) {
//         // 此处需要判断下i的数值范围
//         // 0-90 90 -i
//         // 90 -180  90 + i

//         let point = calculatingTargetPoints(
//             center.lon,
//             center.lat,
//             Number(center.alt),
//             i * (Math.PI / 180),
//             // (90 - i) * (Math.PI / 180),
//             radius
//         );
//         list.push(point[0]);
//         list.push(point[1]);
//     }
//     list.push(Number(center.lon));
//     list.push(Number(center.lat));
//     return list
// }
// /**
//  * @description 画扇形
//  * @param {int} lon 中心点经度
//  * @param {*} lat 中心点纬度
//  * @param {*} height 中心点高度
//  * @param {*} direction 方向
//  * @param {*} radius 半径
//  */
// function calculatingTargetPoints(lon, lat, height, direction, radius) {
//     //根据位置，方位，距离求经纬度
//     let viewPoint = Cesium.Cartesian3.fromDegrees(lon, lat, height);
//     let webMercatorProjection = new Cesium.WebMercatorProjection();
//     let viewPointWebMercator = webMercatorProjection.project(
//         Cesium.Cartographic.fromCartesian(viewPoint)
//     );
//     let toPoint = new Cesium.Cartesian3(
//         viewPointWebMercator.x + radius * Math.cos(direction),
//         viewPointWebMercator.y + radius * Math.sin(direction),
//         height
//     );
//     toPoint = webMercatorProjection.unproject(toPoint);
//     toPoint = Cesium.Cartographic.toCartesian(toPoint.clone());
//     let cartographic = Cesium.Cartographic.fromCartesian(toPoint);
//     let point = [
//         Cesium.Math.toDegrees(cartographic.longitude),
//         Cesium.Math.toDegrees(cartographic.latitude),
//     ];
//     return point;
// }
//#endregion

// // 假设当前模型的经纬度坐标为{114, 30, 1000} 方位角{heading: 30, pitch: 20, roll: 10} 都是角度来计算 
// // 1. 根据坐标, 方位角计算世界矩阵
// var position = Cesium.Cartesian3.fromDegrees(114, 30, 1000);
// var heading = Cesium.Math.toRadians(30);
// var pitch = Cesium.Math.toRadians(20);
// var roll = Cesium.Math.toRadians(10);
// var headingPitchRoll = new Cesium.HeadingPitchRoll(heading, pitch, roll);
// console.log(headingPitchRoll);
// var m = Cesium.Transforms.headingPitchRollToFixedFrame(position, headingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.Matrix4());

// console.log();
// // 2. 根据矩阵求方位角
// // 我们就用上面得到的矩阵 m 来做测试
// // 计算中心处的变换矩阵
// var m1 = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Matrix4.getTranslation(m, new Cesium.Cartesian3()), Cesium.Ellipsoid.WGS84, new Cesium.Matrix4());
// // 矩阵相除
// var m3 = Cesium.Matrix4.multiply(Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()), m, new Cesium.Matrix4());
// // 得到旋转矩阵
// var mat3 = Cesium.Matrix4.getRotation(m3, new Cesium.Matrix3());
// // 计算四元数
// var q = Cesium.Quaternion.fromRotationMatrix(mat3);
// console.log(q);
// // // 计算旋转角(弧度)
// var hpr = Cesium.HeadingPitchRoll.fromQuaternion(pointEntity.orientation.getValue(viewer.clock.currentTime));
// // 得到角度
// var heading = Cesium.Math.toDegrees(hpr.heading);
// var pitch = Cesium.Math.toDegrees(hpr.pitch);
// var roll = Cesium.Math.toDegrees(hpr.roll);
// console.log('heading : ' + heading, 'pitch : ' + pitch, 'roll : ' + roll);
// let waveA = new Wave({
//     viewer,
//     id: 'wave-' + parseInt(Math.random() * 1000),
//     heading: 120,
//     angle: 60,
//     entity: pointEntity,
//     color:"#17DCF3",
//     count: 8,
//     radius: 60000
// })
// waveA.add()

//#region 
// // 创建实体
// viewer.entities.getById("circleWave").position = new Cesium.CallbackProperty(time => {
//     if (pointEntity.position.getValue(time)) {
//         return pointEntity.position.getValue(time)
//         // let position_tmp = Cartesian3ToWGS84(pointEntity.position.getValue(time))
//         // let points = drawSector({
//         //     angleFirst: 0,
//         //     angleSecond: 90,
//         //     center: {
//         //         lon: Number(position_tmp.lon),
//         //         lat: Number(position_tmp.lat),
//         //         alt: Number(position_tmp.alt)
//         //     },
//         //     radius: 3000
//         // })
//         // viewer.entities.getById("circleWave").polygon.height = Number(position_tmp.alt)
//         // // PolygonHierarchy 定义多边形及其孔的线性环的层次结构（空间坐标数组）
//         // return new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(points));
//     }
// }, false)
//#endregion
//#region 
// viewer.entities.getById("circleWave").polygon.hierarchy = new Cesium.CallbackProperty(time => {
//     if (pointEntity.position.getValue(time)) {
//         let position_tmp = Cartesian3ToWGS84(pointEntity.position.getValue(time))
//         let points = drawSector({
//             angleFirst: 0,
//             angleSecond: 90,
//             center: {
//                 lon: Number(position_tmp.lon),
//                 lat: Number(position_tmp.lat),
//                 alt: Number(position_tmp.alt)
//             },
//             radius: 3000
//         })
//         viewer.entities.getById("circleWave").polygon.height = Number(position_tmp.alt)
//         // PolygonHierarchy 定义多边形及其孔的线性环的层次结构（空间坐标数组）
//         return new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(points));
//     }
// }, false)
//#endregion
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113.940, 22.512, 12000)
})

window.viewer = viewer;