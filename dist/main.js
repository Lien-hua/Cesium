/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("\r\n// import cesiumNavMixin from '../node_modules/cesium-navigation-es6/dist/CesiumNavigation.js';\r\n// console.log(cesiumNavMixin);\r\n// 挂载cesium到window.viewer\r\nlet viewer = new Cesium.Viewer('cesium-container', {\r\n    shouldAnimate: false,\r\n    animation: true, //是否创建动画小器件，左下角仪表\r\n    baseLayerPicker: true, //是否显示图层选择器\r\n    fullscreenButton: false, //是否显示全屏按钮\r\n    geocoder: false, //是否显示geocoder小器件，右上角查询按钮\r\n    homeButton: false, //是否显示Home按钮\r\n    infoBox: false, //是否显示信息框\r\n    selectionIndicator: true, //是否显示选取指示器组件\r\n    timeline: true, //是否显示时间轴\r\n    sceneMode: Cesium.SceneMode\r\n        .SCENE3D, //设定3维地图的默认场景模式:Cesium.SceneMode.SCENE2D、Cesium.SceneMode.SCENE3D、Cesium.SceneMode.MORPHING\r\n    navigationHelpButton: false, //是否显示右上角的帮助按钮\r\n    scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源\r\n    navigationInstructionsInitiallyVisible: false,\r\n    showRenderLoopErrors: true, //是否显示渲染错误\r\n});\r\nlet imageryProviderViewModels = viewer.baseLayerPicker.viewModel.imageryProviderViewModels;\r\nviewer.baseLayerPicker.viewModel.selectedImagery = imageryProviderViewModels[imageryProviderViewModels.length -\r\n    1];\r\n// // //取消双击事件\r\nviewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);\r\n//开启深度检测\r\nviewer.scene.globe.depthTestAgainstTerrain = true;\r\n// 创建时间轴\r\nlet start = Cesium.JulianDate.fromDate(new Date());\r\nlet stop = Cesium.JulianDate.addSeconds(\r\n    start,\r\n    360,\r\n    new Cesium.JulianDate()\r\n);\r\n// 绑定时间轴\r\nviewer.clock.startTime = start.clone()\r\nviewer.clock.currentTime = start.clone();\r\n// 设置时钟结束时间\r\nviewer.clock.stopTime = stop.clone();\r\nviewer.clock.multiplier = 10;\r\n\r\n// 随着位置修改波纹位置\r\n// 添加附着实体\r\nfunction computeCirclularFlight(lon, lat, radius) {\r\n    var property = new Cesium.SampledPositionProperty();\r\n    for (var i = 0; i <= 360; i += 45) {\r\n        var radians = Cesium.Math.toRadians(i);\r\n        var time = Cesium.JulianDate.addSeconds(\r\n            start,\r\n            i,\r\n            new Cesium.JulianDate()\r\n        );\r\n        var position = Cesium.Cartesian3.fromDegrees(\r\n            lon + (radius * 1.5 * Math.cos(radians)),\r\n            lat + (radius * Math.sin(radians)),\r\n            8000\r\n        );\r\n\r\n        property.addSample(time, position);\r\n\r\n        let e = viewer.entities.add({\r\n            position: position,\r\n            point: {\r\n                pixelSize: 8,\r\n                color: Cesium.Color.TRANSPARENT,\r\n                outlineColor: Cesium.Color.YELLOW,\r\n                outlineWidth: 3,\r\n            },\r\n        });\r\n    }\r\n    return property;\r\n}\r\nvar position = computeCirclularFlight(113.940, 22.512, 0.03);\r\nlet pointEntity = viewer.entities.add({\r\n    id: \"point\",\r\n    availability: new Cesium.TimeIntervalCollection([\r\n        new Cesium.TimeInterval({\r\n            start: start,\r\n            stop: stop,\r\n        }),\r\n    ]),\r\n    position: position,\r\n    orientation: new Cesium.VelocityOrientationProperty(position),\r\n    model: {\r\n        uri: './air.glb', // 模型路径\r\n        minimumPixelSize: 64,\r\n    }\r\n})\r\npointEntity.position.setInterpolationOptions({\r\n    interpolationDegree: 5,\r\n    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation\r\n})\r\npointEntity.path = {\r\n    resolution: 1,\r\n    material: new Cesium.PolylineGlowMaterialProperty({\r\n        glowPower: 0.1,\r\n        color: Cesium.Color.RED\r\n    }),\r\n    width: 10\r\n}\r\nlet circleWave = new CircleWave(\r\n    viewer,\r\n    \"circleWave\",\r\n    '#1FA8E3',\r\n    10,\r\n    100,\r\n    100,\r\n    pointEntity,\r\n    new Cesium.TimeIntervalCollection([\r\n        new Cesium.TimeInterval({\r\n            start: start,\r\n            stop: stop,\r\n        }),\r\n    ]),\r\n    8\r\n);\r\n// 雷达平扫\r\n// const circleScan = new CircleScan(viewer);\r\n// circleScan.add([113.940, 22.512, 8000], '#BB00FF', 400, 3000, pointEntity);\r\n\r\nviewer.camera.flyTo({\r\n    destination: Cesium.Cartesian3.fromDegrees(113.940, 22.512, 12000)\r\n})\r\n\r\nwindow.viewer = viewer;\n\n//# sourceURL=webpack://cesium-study/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;