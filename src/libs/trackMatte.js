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
export function radarSolidScan(options) {
  let _viewer = options.viewer;
  // 半径
  let _radius = options.radius * 1000; //米转为千米
  // 扫描扇形颜色
  let _color = options.color;
  // 扫描速度 options.speed  转速默认是5
  let _speed = 5;
  // 中心点坐标经纬度
  let _center = Cartesian3ToWGS84(options.position);
  // 效果id
  let _effectId = options.effectId;
  let _bindTime = options.bindTime;
  let _bindTimeOpts = options.bindTimeOpts;

  // 将c3转为经纬度
  function Cartesian3ToWGS84(point) {
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
  // 创建默认实体
  _viewer.entities.add({
    id: _effectId,
    name: "立体雷达扫描",
    ellipsoid: {
      radii: new Cesium.Cartesian3(_radius, _radius, _radius),
      material: Cesium.Color.fromCssColorString(_color).withAlpha(
        0.2
      ),
      maximumCone: Cesium.Math.toRadians(90),
      outline: true, // 控制球边框
      outlineColor: Cesium.Color.WHITE.withAlpha(.2),
      outlineWidth: 1,
      stackPartitions: 16
    },
    // 扇形底面
    ellipse: {
      semiMinorAxis: _radius, // 指定半短轴的数字属性。
      semiMajorAxis: _radius, // 指定半长轴的数值属性。
      material: Cesium.Color.fromCssColorString(_color).withAlpha(
        0.2
      ),
    },
    // 旋转扇叶
    wall: {
      material: Cesium.Color.fromCssColorString(_color).withAlpha(
        0.6
      ),
    }, // 创建1/4圆形
  })
  // 判断当前所创实体是否与时间进行绑定
  let effectEntity = _viewer.entities.getById(_effectId);
  if (_bindTime) {
    effectEntity.availability = options.bindTimeOpts.availability;
  }

  let heading = 0;
  // 每一帧刷新时调用
  _viewer.clock.onTick.addEventListener((time) => {
    heading += _speed;
    // 获取当前所附实体的位置信息
    if (_bindTimeOpts.entityId.position.getValue(time._currentTime)) {
      // 将当前实体位置转为经纬度
      let currentpos = Cartesian3ToWGS84(_bindTimeOpts.entityId.position.getValue(time._currentTime))
      // 获取当前实体的wall实体
      let effectEntity = viewer.entities.getById(_effectId),
        positionArr = calculatePane(
          Number(currentpos.lon),
          Number(currentpos.lat),
          Number(_radius),
          heading,
          Number(currentpos.alt)).positionArr,
        heightsArr = calculatePane(
          Number(currentpos.lon),
          Number(currentpos.lat),
          Number(_radius),
          heading,
          Number(currentpos.alt)).heightsArr;

          console.log(effectEntity);
      effectEntity.position = new Cesium.CallbackProperty(() => {
        return _bindTimeOpts.entityId.position.getValue(time._currentTime)
      })
      effectEntity.wall.positions = new Cesium.CallbackProperty(() => {
        return Cesium.Cartesian3.fromDegreesArrayHeights(positionArr);
      }, false);
      effectEntity.wall.minimumHeights = new Cesium.CallbackProperty(() => {
        return heightsArr;
      }, false);
      effectEntity.ellipse.height = Number(currentpos.alt); // 更改底面圆形高度
    }

  })
  // 计算平面扫描范围
  function calculatePane(x1, y1, radius, heading, height) {
    var m = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(x1, y1, height));
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
    let positionArr = [],
      heightsArr = [];
    positionArr.push(x1);
    positionArr.push(y1);
    positionArr.push(z);
    heightsArr.push(z)

    let radius = _radius;
    // 扇形是1/4圆，因此角度设置为0-90
    for (let i = 0; i <= 90; i++) {
      let h = radius * Math.sin(i * Math.PI / 180.0) + z
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