<!-- 侧边栏 -->
<template>
    <div class="sidebar">
        <div class="title"><span>Cesium</span> 样例</div>
        <el-menu mode="vertical" class="sidebar-menu" background-color="transparent" text-color="var(--default-color)"
            active-text-color="var(--default-bgcolor)"
            @select="getExamples"
            :collapse="false"
            >
            <!-- 基础内容 -->
            <el-sub-menu index="basic-content">
                <template #title>
                    <el-icon>
                        <List />
                    </el-icon>
                    <span>基础内容</span>
                </template>
                <el-menu-item index="imagery-change">图层切换</el-menu-item>
                <el-menu-item index="sky-box">天空盒</el-menu-item>
                <el-menu-item-group title="entity实体">
                    <el-menu-item index="1-3">扇形</el-menu-item>
                    <el-menu-item index="1-4">wall</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="other">
                    <template #title>其他</template>
                    <el-menu-item index="1-4-1">pop弹窗</el-menu-item>
                </el-sub-menu>
            </el-sub-menu>

            <!-- 雷达效果 -->
            <el-sub-menu index="radar-effect">
                <template #title>
                    <el-icon>
                        <Aim />
                    </el-icon>
                    <span>雷达效果</span>
                </template>
                <el-menu-item index="sphereRadar">半球雷达</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>
<script setup>
import '../styles/light.scss'
const getExamples=(index) => {
    console.log('当前选中的菜单项');
    console.log(index);
}
</script>
<style lang="scss" scoped>
.sidebar {
    color: var(--default-color);

    .title {
        width: 100%;
        text-align: center;
        height: 64px;
        line-height: 64px;
        font-size: 1.2rem;
        font-weight: bolder;

        span {
            font-size: 1.6rem;
            color: var(--sidebar-menu-active-color)
        }
    }
}
</style>