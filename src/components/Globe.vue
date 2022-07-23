<!-- cesium地球组件 -->
<template>
    <div id="cesiumContainer" class="cesiumContainer"></div>
</template>
<script setup>
import * as Cesium from 'cesium';
import { onMounted } from 'vue';
onMounted(() => {
    let viewer = new Cesium.Viewer('cesiumContainer', {
        shouldAnimate: false,
        animation: false, //是否创建动画小器件，左下角仪表
        baseLayerPicker: true, //是否显示图层选择器
        fullscreenButton: false, //是否显示全屏按钮
        geocoder: false, //是否显示geocoder小器件，右上角查询按钮
        homeButton: false, //是否显示Home按钮
        infoBox: false, //是否显示信息框
        selectionIndicator: false, //是否显示选取指示器组件
        timeline: false, //是否显示时间轴
        sceneMode: Cesium.SceneMode
            .SCENE3D, //设定3维地图的默认场景模式:Cesium.SceneMode.SCENE2D、Cesium.SceneMode.SCENE3D、Cesium.SceneMode.MORPHING
        navigationHelpButton: false, //是否显示右上角的帮助按钮
        scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        navigationInstructionsInitiallyVisible: false,
        showRenderLoopErrors: true, //是否显示渲染错误
        orderIndependentTranslucency: false,
        contextOptions:{
            webgl:{
                alpha: true
            }
        }
    });
    //取消双击事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    //开启深度检测
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.cesiumWidget.creditContainer.style.display = "none";
    let imageryProviderViewModels = viewer.baseLayerPicker.viewModel.imageryProviderViewModels;
    viewer.baseLayerPicker.viewModel.selectedImagery = imageryProviderViewModels[imageryProviderViewModels.length -
        3];
        // 隐藏天空盒
        viewer.scene.skyBox.show = false;
        viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0)

});
</script>
<style lang="scss" scoped>
.cesiumContainer {
    width: 100vw;
    height: 100vh;
    background-image: url('../assets/images/globe_bg.jpg');
    background-size: 100% 100%;
    box-shadow:inset 0px 0px 100px 0px rgba(59, 139, 196, .8);
    border-radius: 10px;
}
</style>