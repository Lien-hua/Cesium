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
viewer.scene.globe.depthTestAgainstTerrain = false;

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

viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113.940, 22.512, 12000)
})

forceEffect.radarSolidScan({
    viewer: viewer,
    effectId: "half-circle",
    radius: 1,
    color: "#1AF34D",
    speed: 2,
    position: pointEntity.position.getValue(viewer.clock.currentTime),
    bindTime: false,
    bindTimeOpts: {
        availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start,
            stop
        })]),
        entityId: pointEntity // 所附实体的信息
    }
})
window.viewer = viewer;