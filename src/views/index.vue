<template>
  <div class="cus-body">
    <el-container>
      <el-aside
        v-if="!route.meta.noMenu"
        class="cus-menu"
      >
        <Menu />
      </el-aside>
      <!--主内容-->
      <el-main class="cus-main">
        <keep-alive>
          <router-view v-if="route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!route.meta.keepAlive" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import Menu from '../layout/Menu.vue'
import {useRoute} from "vue-router"
const route = useRoute()
</script>

<style lang="scss" scoped>
@import "@/styles/_variables";
.cus-body {
  .cus-menu {
    width: 212px;
    height: $--full-height;
  }
  .cus-main {
    padding: 24px;
    height: $--full-height;
    box-sizing: border-box;
  }
}
@media (max-width: 1600px) {
  .cus-body {
    .cus-menu {
      width: 150px;
    }
    .cus-main {
      padding: 16px;
    }
  }
}
</style>
