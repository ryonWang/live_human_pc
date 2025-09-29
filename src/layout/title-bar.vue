<template>
  <div data-tauri-drag-region class="title-bar">
    <div class="flex1"></div>
    <div
      :class="['title-bar-button', isAlwaysOnTop ? 'active' : '']"
      @click="toggleAlwaysOnTop"
    >
      <svg class="icon icon-menu" aria-hidden="true">
        <use xlink:href="#icon-window_pin" />
      </svg>
    </div>
    <div class="title-bar-button" @click="minimizeWindow">
      <svg class="icon icon-menu" aria-hidden="true">
        <use xlink:href="#icon-window_minimize" />
      </svg>
    </div>
    <div class="title-bar-button" @click="toggleWindow">
      <svg v-if="isMaximize" class="icon icon-menu" aria-hidden="true">
        <use xlink:href="#icon-window_init_size" />
      </svg>
      <svg v-else class="icon icon-menu" aria-hidden="true">
        <use xlink:href="#icon-window_maximize" />
      </svg>
    </div>
    <div class="title-bar-button red" @click="closeWindow">
      <svg class="icon icon-menu" aria-hidden="true">
        <use xlink:href="#icon-window_close" />
      </svg>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import { getCurrentWindow  } from '@tauri-apps/api/window'
const currentWindow = getCurrentWindow()
const isMaximize = ref(false)
const isAlwaysOnTop = ref(false)
onMounted(async () => {
  isMaximize.value = await currentWindow.isMaximized()
})
const minimizeWindow = () => {
  currentWindow.minimize()
}
const toggleWindow = async () => {
  currentWindow.toggleMaximize()
  isMaximize.value = !isMaximize.value
}
const closeWindow = () => {
  currentWindow.close()
}
const toggleAlwaysOnTop = async () => {
  isAlwaysOnTop.value = !isAlwaysOnTop.value
  await currentWindow.setAlwaysOnTop(isAlwaysOnTop.value)
}
</script>
<style scoped lang="scss">
  .title-bar {
    height: 40px;
    width: 100%;
    background: #252528;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    .title-bar-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 46px;
      height: 40px;
      font-size: 24px;
      cursor: pointer;
      &:hover {
        background: #1B1B1C;
      }
      &.active {
        background: #1B1B1C;
      }
      &.red:hover {
        background: #B21416;
      }
    }
  }
</style>
