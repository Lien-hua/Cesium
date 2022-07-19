// 半球雷达效果
/**
 * 
 * @param {option} 
 * effectId 效果id
 * viewer
 * radius 半径
 * color 颜色 Cesium.Color类型
 * speed 中间旋转页速度
 * position 半球球心  
 * bindTime 是否与时间绑定
 * bindTimeOpts 在绑定时间的前提下，相关的参数信息
 */
/**
 * forceEffect.radarSolidScan({
        viewer: window.viewer,
        effectId: effectOpts.effectTmpId,
        radius: effectOpts.radius,
        color: effectOpts.color,
        position: store.state.currentEntity.position.getValue(
          window.viewer.clock.currentTime
        ),
        bindTime: false,
        bindTimeOpts: {
          entityId: store.state.currentEntity, // 所附实体的信息
        },
      })
 */
 import * as Cesium from '@../../../node_modules/cesium/Source/Cesium'
 export function radarSolidScan(options) {
     this._viewer = options.viewer;
     // 半径
     this._radius = options.radius * 1000;   //米转为千米
     // 扫描扇形颜色
     this._color = options.color;
     // 扫描速度 options.speed  转速默认是5
     this._speed = 5;
     // 中心点坐标经纬度
     this._center = options.position;
     // 效果id
     this._effectId = options.effectId;
     this._bindTime = options.bindTime;
     this._bindTimeOpts = options.bindTimeOpts;
 
     this.positionArr = calculatePane(
         Number(this._center.lon),
         Number(this._center.lat),
         Number(this._radius),
         0,
         Number(this._center.alt)).positionArr;
 
     this.heightsArr = calculatePane(
         Number(this._center.lon),
         Number(this._center.lat),
         Number(this._radius),
         0,
         Number(this._center.alt)).heightsArr;
 
     if (this._bindTime != undefined) {
         // 先建立椭球体
         this._viewer.entities.add({
             id: this._effectId,
             name: "立体雷达扫描",
             availability: this._bindTimeOpts.availability,
             position: this._bindTimeOpts.position,
             // wall: {
             //     positions: new Cesium.CallbackProperty(() => {
             //         return Cesium.Cartesian3.fromDegreesArrayHeights(this.positionArr);
             //     }, false),
             //     material: this._color,
             //     minimumHeights: new Cesium.CallbackProperty(() => {
             //         return this.heightsArr;
             //     }, false)
             // }, // 创建1/4圆形
             ellipsoid: {
                 radii: new Cesium.Cartesian3(this._radius, this._radius, this._radius),
                 material: this._color,
                 maximumCone: Cesium.Math.toRadians(90),
                 outline: true,  // 控制球边框
                 outlineColor: Cesium.Color.WHITE.withAlpha(.2),
                 outlineWidth: 1,
             }
         })
     } else {
         // 先建立椭球体
         this._viewer.entities.add({
             id: this._effectId,
             name: "立体雷达扫描",
             position: Cesium.Cartesian3.fromDegrees(
                 Number(this._center.lon),
                 Number(this._center.lat),
                 Number(this._center.alt)),
             // wall: {
             //     positions: Cesium.Cartesian3.fromDegreesArrayHeights(this.positionArr),
             //     // new Cesium.CallbackProperty(() => {
             //     //     return Cesium.Cartesian3.fromDegreesArrayHeights(this.positionArr);
             //     // }, false),
             //     material: this._color,
             //     // minimumHeights: new Cesium.CallbackProperty(() => {
             //     //     return this.heightsArr;
             //     // }, false)
             // }, // 创建1/4圆形
             ellipsoid: {
                 radii: new Cesium.Cartesian3(this._radius, this._radius, this._radius),
                 material: this._color,
                 maximumCone: Cesium.Math.toRadians(90),
                 outline: true,  // 控制球边框
                 outlineColor: Cesium.Color.WHITE.withAlpha(.2),
                 outlineWidth: 1,
             }
         })
     }
 
     let heading = 0;
     // 每一帧刷新时调用
     // this._viewer.clock.onTick.addEventListener(() => {
     //     heading += this._speed;
     //     this.positionArr = calculatePane(
     //         Number(this._center.lon),
     //         Number(this._center.lat),
     //         Number(this._radius),
     //         heading,
     //         Number(this._center.alt)).positionArr;
     //     this.heightsArr = calculatePane(
     //         Number(this._center.lon),
     //         Number(this._center.lat),
     //         Number(this._radius),
     //         0,
     //         Number(this._center.alt)).heightsArr;
     //         console.log(this.positionArr, this.heightsArr);
     // })
     // 计算平面扫描范围
     function calculatePane(x1, y1, radius, heading, height) {
         var m = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(x1, y1));
         var rx = radius * Math.cos(heading * Math.PI / 180.0);
         var ry = radius * Math.sin(heading * Math.PI / 180.0);
         var translation = Cesium.Cartesian3.fromElements(rx, ry, 0);
         var d = Cesium.Matrix4.multiplyByPoint(
             m,
             translation,
             new Cesium.Cartesian3()
         );
         var c = Cesium.Cartographic.fromCartesian(d);
         var x2 = Cesium.Math.toDegrees(c.longitude);
         var y2 = Cesium.Math.toDegrees(c.latitude);
         return calculateSector(x1, y1, x2, y2, height);
     }
 
     // 计算竖直扇形
     function calculateSector(x1, y1, x2, y2, z) {
         let positionArr = [], heightsArr = [];
         positionArr.push(x1);
         positionArr.push(y1);
         positionArr.push(z);
 
         heightsArr.push(z)
 
         let radius = options.radius;
         // 扇形是1/4圆，因此角度设置为0-90
         for (let i = 0; i <= 90; i++) {
             let h = radius * Math.sin(i * Math.PI / 180.0) < z ? z : radius * Math.sin(i * Math.PI / 180.0);
             let r = Math.cos(i * Math.PI / 180.0);
             let x = (x2 - x1) * r + x1;
             let y = (y2 - y1) * r + y1;
             positionArr.push(x);
             positionArr.push(y);
             positionArr.push(h);
 
             heightsArr.push(z)
         }
         return {
             positionArr,
             heightsArr
         };
     }
 }
 
 