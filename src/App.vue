<template>
  <view class="page">
    <TitleBar v-if="isTauri === 'true'"></TitleBar>
    <router-view />
  </view>
</template>
<script setup>
import { onBeforeMount } from "vue"
import TitleBar from '@/layout/title-bar.vue'
const isTauri = import.meta.env.VITE_APP_IS_TAURI
import { relaunch } from '@tauri-apps/plugin-process'

onBeforeMount(() => {
  if (isTauri === 'true') {
    document.documentElement.style.setProperty('--full-height', `calc(100vh - 40px)`)
  } else {
    document.documentElement.style.setProperty('--full-height', `100vh`)
  }
})

</script>
