
    // calculatingTargetPoints = (lon, lat, height, direction, radius) => {
    //     //根据位置，方位，距离求经纬度
    //     let viewPoint = Cesium.Cartesian3.fromDegrees(lon, lat, height);
    //     let webMercatorProjection = new Cesium.WebMercatorProjection();
    //     let viewPointWebMercator = webMercatorProjection.project(
    //         Cesium.Cartographic.fromCartesian(viewPoint)
    //     );
    //     let toPoint = new Cesium.Cartesian3(
    //         viewPointWebMercator.x + radius * Math.cos(direction),
    //         viewPointWebMercator.y + radius * Math.sin(direction),
    //         0
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

    <!-- 计算实体的姿态 -->
    `
    var mtx3 = Cesium.Matrix3.fromQuaternion(pointEntity.orientation.getValue(viewer.clock.currentTime));
var mtx4 = Cesium.Matrix4.fromRotationTranslation(mtx3, pointEntity.position.getValue(viewer.clock.currentTime), new Cesium.Matrix4());
var hpr = Cesium.Transforms.fixedFrameToHeadingPitchRoll(mtx4, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, new Cesium.HeadingPitchRoll());
var heading = Cesium.Math.toDegrees(hpr.heading);
var pitch = Cesium.Math.toDegrees(hpr.pitch);
var roll = Cesium.Math.toDegrees(hpr.roll);
    `