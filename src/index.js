
// import cesiumNavMixin from '../node_modules/cesium-navigation-es6/dist/CesiumNavigation.js';
// console.log(cesiumNavMixin);
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
    3];
viewer.cesiumWidget.creditContainer.style.display = "none";
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
viewer.clock.multiplier = 10;
viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;

// // 随着位置修改波纹位置
// // 添加附着实体
// function computeCirclularFlight(lon, lat, radius) {
//     var property = new Cesium.SampledPositionProperty();
//     for (var i = 0; i <= 360; i += 45) {
//         var radians = Cesium.Math.toRadians(i);
//         var time = Cesium.JulianDate.addSeconds(
//             start,
//             i,
//             new Cesium.JulianDate()
//         );
//         var position = Cesium.Cartesian3.fromDegrees(
//             lon + (radius * 1.5 * Math.cos(radians)),
//             lat + (radius * Math.sin(radians)),
//             8000
//         );

//         property.addSample(time, position);

//         let e = viewer.entities.add({
//             position: position,
//             point: {
//                 pixelSize: 8,
//                 color: Cesium.Color.TRANSPARENT,
//                 outlineColor: Cesium.Color.YELLOW,
//                 outlineWidth: 3,
//             },
//         });
//     }
//     return property;
// }
// var position = computeCirclularFlight(113.940, 22.512, 0.03);
// let pointEntity = viewer.entities.add({
//     id: "point",
//     availability: new Cesium.TimeIntervalCollection([
//         new Cesium.TimeInterval({
//             start: start,
//             stop: stop,
//         }),
//     ]),
//     position: position,
//     orientation: new Cesium.VelocityOrientationProperty(position),
//     model: {
//         uri: './air.glb', // 模型路径
//         minimumPixelSize: 64,
//     }
// })
// pointEntity.position.setInterpolationOptions({
//     interpolationDegree: 5,
//     interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
// })
// pointEntity.path = {
//     resolution: 1,
//     material: new Cesium.PolylineGlowMaterialProperty({
//         glowPower: 0.1,
//         color: Cesium.Color.RED
//     }),
//     width: 10
// }
//#region 
// let circleWave = new CircleWave(
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
//#endregion
// 雷达平扫
//#region 
// // const circleScan = new CircleScan(viewer);
// // circleScan.add([113.940, 22.512, 8000], '#BB00FF', 400, 3000, pointEntity);
// var controls = []
// controls.push(Cesium.Cartesian3.fromDegrees(120.11551237582385, 35.97934910503657, 1000))
// controls.push(Cesium.Cartesian3.fromDegrees(121.1367529, 35.9629172, 6000))
// controls.push(Cesium.Cartesian3.fromDegrees(122.1367529, 36.9629172, 1000))
// // controls.push(Cesium.Cartesian3.fromDegrees(123.8632471, 36.9629172, 1000))
// // controls.push(Cesium.Cartesian3.fromDegrees(124.1367529, 35.9629172, 1000))

// var spline = new Cesium.CatmullRomSpline({
//     points: controls,
//     times: [0.0, 0.15, 1],
// });

// var positions = [], polyline_positions = [], num = 10;
// // 位置与时间绑定公式
// function computeCirclularFlight() {
//     var property = new Cesium.SampledPositionProperty();
//     for (var i = 0; i <= num; i++) {
//         var cartesian3 = spline.evaluate(i / num);
//         var time = Cesium.JulianDate.addSeconds(
//             start,
//             i * 360 / num, //10
//             new Cesium.JulianDate()
//         );
//         polyline_positions.push(cartesian3);
//         viewer.entities.add({
//             position: cartesian3,
//             point: {
//                 color: Cesium.Color.BLUE,
//                 pixelSize: 6,
//             },
//         });
//         property.addSample(time, cartesian3);
//     }
//     return property;

// }
// positions = computeCirclularFlight();
// let pointEntity = viewer.entities.add({
//     id: "point",
//     availability: new Cesium.TimeIntervalCollection([
//         new Cesium.TimeInterval({
//             start: start,
//             stop: stop,
//         }),
//     ]),
//     position: positions,
//     orientation: new Cesium.VelocityOrientationProperty(positions),
//     model: {
//         uri: './air.glb', // 模型路径
//         minimumPixelSize: 64,
//     }
// })
// // viewer.entities.add({
// //     name: "CatmullRomSpline",
// //     polyline: {
// //       positions: polyline_positions,
// //       width: 3,
// //       material: Cesium.Color.WHITE,
// //     },
// //   });
// pointEntity.position.setInterpolationOptions({
//     interpolationDegree: 5,
//     interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
// })
// pointEntity.path = {
//     resolution: 1,
//     material: new Cesium.PolylineGlowMaterialProperty({
//         glowPower: 0.1,
//         color: Cesium.Color.RED
//     }),
//     width: 10
// }
// viewer.camera.flyTo({
//     destination: Cesium.Cartesian3.fromDegrees(120.11551237582385, 35.97934910503657, 12000)
// })
//#endregion

// This example illustrates a Callback Property, a property whose
// value is lazily evaluated by a callback function.
// Use a CallbackProperty when your data can't be pre-computed
// or needs to be derived from other properties at runtime.
viewer.clock.shouldAnimate = true;

var startLatitude = 35;
var startLongitude = -120;
var endLongitude;
var startTime = Cesium.JulianDate.now();
var stTime = startTime;


// Add a polyline to the scene. Positions are dynamic.
var isConstant = false;
var redLine = viewer.entities.add({
  polyline: {
    // This callback updates positions each frame.
    positions: new Cesium.CallbackProperty(function (time, result) {
    //   endLongitude =
    //     startLongitude +
    //     0.001 * Cesium.JulianDate.secondsDifference(time, startTime);
      
      // 平滑前效果
      // return computeCirclularFlight(-112.110693, 36.0994841, 0.03, time);
      // 平滑后效果
      return computeCirclularFlightSmoothly(-112.110693, 36.0994841, 0.03, 500, stTime, time);
      /*
      return Cesium.Cartesian3.fromDegreesArray(
        [startLongitude, startLatitude, endLongitude, startLatitude],
        Cesium.Ellipsoid.WGS84,
        result
      );
      */
    }, isConstant),
    width: 5,
    material: Cesium.Color.RED,
  },
});


//Generate a random circular pattern with varying heights.
function computeCirclularFlight(lon, lat, radius, curTime) {

        // let a = JulianDate.secondsDifference(JulianDate.now(), stTime);
         let positions = [];
        // Generate a random circular pattern with letying heights.
        let property = new Cesium.SampledPositionProperty();
        for (let i = 0; i <= 360; i += 45) {
            let radians = Cesium.Math.toRadians(i);
            let time = Cesium.JulianDate.addSeconds(
                stTime,
                i,
                new Cesium.JulianDate()
            );
        
            let position = Cesium.Cartesian3.fromDegrees(
                lon + radius * 1.5 * Math.cos(radians),
                lat + radius * Math.sin(radians),
                Cesium.Math.nextRandomNumber() * 500 + 
                    Math.random() * 20 * Cesium.JulianDate.secondsDifference(curTime, stTime)
            );
        
            positions.push(position);
            property.addSample(time, position);
      }

      return positions;
}

    // Generate a random circular pattern with varying heights.
    function computeCirclularFlightSmoothly(lon, lat, radius, levelHeight, stTime, curTime) {

        // let a = JulianDate.secondsDifference(JulianDate.now(), stTime);
        let positions = [];
        let llhPositions = [];
        // let property = new PositionProperty();
        // Generate a random circular pattern with letying heights.
        for (let i = 0; i <= 360; i += 45) {
            let radians = Cesium.Math.toRadians(i);
            let time = Cesium.JulianDate.addSeconds(
                stTime,
                i,
                new Cesium.JulianDate()
            );

            let tmpPoint = new Cesium.Cartographic(
                lon + radius * 1.5 * Math.cos(radians),
                lat + radius * Math.sin(radians),
                Cesium.Math.nextRandomNumber() * 0.1 * levelHeight + levelHeight +
                    Math.random() * 20 // * Cesium.JulianDate.secondsDifference(curTime, stTime)
            );
            llhPositions.push(tmpPoint);
            positions.push(
                Cesium.Cartesian3.fromDegrees(
                    tmpPoint.longitude,
                    tmpPoint.latitude,
                    tmpPoint.height
            ));
        }
 
        // let iptPositions = Array<Cartographic>();
        let iptPositions = [];
        let xRes = [];
        let xTable = [];        // interpolate at xTable[i]
        for(let ix = 0; ix < positions.length; ++ix) {
            xTable.push(ix * 100);
        }
        let yTable = [];        // used to interpolate, in {la1, lon1, h1, l2, lon2, h2}
        for(let iy = 0; iy < positions.length; ++iy) {
            yTable.push(llhPositions[iy].longitude);
            yTable.push(llhPositions[iy].latitude);
            yTable.push(llhPositions[iy].height);
        }
        let yStride = 3;        // 3 dependent vaule in yTable is viewed as one item
        
        for (let ix = 0; ix < xTable[positions.length - 1]; ++ix) {
            let iptRes = [];
            Cesium.LagrangePolynomialApproximation.interpolateOrderZero(
                ix,
                xTable,
                yTable,
                yStride,
                iptRes
            );

            iptPositions.push(
                Cesium.Cartesian3.fromDegrees(
                iptRes[0],
                iptRes[1],
                iptRes[2]
            ));
        }

        return  iptPositions;
    }

// Keep the view centered.
viewer.trackedEntity = redLine;


window.viewer = viewer;