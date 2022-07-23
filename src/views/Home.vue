
<template>
    <el-container class="common-container">
      <el-aside width="15%">
        <Sidebar />
      </el-aside>
      <el-main>
        <Content />
      </el-main>
    </el-container>
</template>
<script setup>
import Sidebar from '../components/Sidebar.vue';
import Content from '../components/Content.vue';
</script>
<style lang="scss" scoped>
.common-container{
  width: 100%;
  height: 100vh;
}
</style>