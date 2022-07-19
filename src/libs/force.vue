<template>
  <div class="basicdialogstyle">
    <div class="close">
      <el-row>
        <el-col :span="8" :offset="8">
          <span>{{ title }}</span>
        </el-col>
        <el-col :span="8">
          <i class="fa fa-close" title="关闭" @click="handleClose"></i>
        </el-col>
      </el-row>
    </div>
    <div class="force-form">
      <el-form size="small" :model="force" label-width="120px">
        <el-form-item label="范围半径">
          <el-slider
            v-model="effectOpts.radius"
            :step="1"
            :min="10"
            :max="1000"
            @input="changeRadius"
          ></el-slider>
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker
            v-model="effectOpts.color"
            @change="changeColor"
          ></el-color-picker>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            label="是否暂停显示"
            v-model="effectOpts.isPause"
          ></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button native-type="reset" size="medium" @click="handleClose"
            >取消</el-button
          >
          <el-button
            native-type="submit"
            size="medium"
            @click.prevent="saveForce"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as comput from '../../functions/MapComput'
import * as forceEffect from '../../libs/radarSolidScan.js'
import * as Cesium from '@../../../node_modules/cesium/Source/Cesium'
import { ElMessage } from 'element-plus'
export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    const data = reactive({
      title: '',
      force: {
        radius: 10000,
        color: '#FFFF00',
        isPause: true,
      },
      half: {
        radius: 10000,
        color: '#00FFFF',
        isPause: true,
      },
      effectTmpId: 'force-' + comput.randomString(6),
      halfEffectTmpId: 'half-' + comput.randomString(6),
      effectOpts: {},
      handleClose() {
        router.push('/')
        // 删除当前临时创建的效果
        window.viewer.entities.remove(window.viewer.entities.getById(data.effectOpts.effectTmpId))
      },
      // 更改当前实体颜色
      changeColor() {
        let color = Cesium.Color.fromCssColorString(data.effectOpts.color),
          effectEnity = window.viewer.entities.getById(data.effectOpts.effectTmpId)
        effectEnity.ellipsoid.material = new Cesium.ImageMaterialProperty({
          color: color.withAlpha(0.4),
        })
      },
      //   更改当前实体的半径
      changeRadius() {
        let effectEnity = window.viewer.entities.getById(data.effectOpts.effectTmpId)
        effectEnity.ellipsoid.radii = new Cesium.Cartesian3(
          Number(data.effectOpts.radius),
          Number(data.effectOpts.radius),
          Number(data.effectOpts.radius)
        )
      },
      //   保存当前效果
      saveForce() {
        // 判断当前实体的类型
        if (data.effectOpts.type == 'forceRange') {
          // 将当前效果添加到相应实体上
          store.state.currentEntity.effect.forceRanges.push({
            eventId: null,
            start: null,
            end: null,
            radius: data.effectOpts.radius,
            color: data.effectOpts.color,
            isPause: data.effectOpts.isPause,
          })
          ElMessage.success('武器威力效果添加成功')
        } else {
          // 将当前效果添加到相应实体上
          store.state.currentEntity.effect.halfRadars.push({
            eventId: null,
            start: null,
            end: null,
            radius: data.effectOpts.radius,
            color: data.effectOpts.color,
            isPause: data.effectOpts.isPause,
          })
          ElMessage.success('半球雷达效果添加成功')
        }
        data.handleClose()
      },
    })
    // 初始化时创建默认的实体, 半径时5000，颜色时浅黄色
    // 鉴于武器威力范围和半球雷达采用相同的界面，所以初始化时需从路由获取相关参数
    onBeforeMount(() => {
      // 根据当前路由判断是哪种类型效果
      let paramData = router.currentRoute._value.params
      data.title = paramData.title + '参数' // 修改标题
      let entityPos = comput.Cartesian3ToWGS84(
          store.state.currentEntity.position.getValue(
            window.viewer.clock.currentTime
          )
        ), // 实体位置
        // 实体朝向
        entityOrientation = store.state.currentEntity.position.getValue(
          window.viewer.clock.currentTime
        ),
        // 效果相关配置
        effectOpts = {}
      // 根据不同效果类型调取不同信息
      if (paramData.value == 'forceRange') {
        effectOpts = data.force
        effectOpts.effectTmpId = data.effectTmpId
        effectOpts.type = 'forceRange'
      } else {
        effectOpts = data.half
        effectOpts.effectTmpId = data.halfEffectTmpId
        effectOpts.type = 'halfRadar'
      }
      forceEffect.radarSolidScan({
        viewer: window.viewer,
        effectId: effectOpts.effectTmpId,
        radius: effectOpts.radius,
        color: new Cesium.ImageMaterialProperty({
          color: Cesium.Color.fromCssColorString(effectOpts.color).withAlpha(
            0.4
          ),
        }),
        speed: 2,
        position: entityPos,
      })
      data.effectOpts = effectOpts
    })

    return {
      ...toRefs(data),
    }
  },
}
</script>
<style lang="less" scoped>
.basicdialogstyle {
  left: 100px;
  top: 200px;
  // height: 30%;
  width: 20%;
  padding: 10px;
}
</style>