<template>
  <div class="preview-cell">
    <img class="bg" src="@/assets/images/ai-video/iphone_bg.png" alt="">
    <img class="tools" src="@/assets/images/ai-video/iphone_tools.png" alt="">
    <div class="preview-content">
      <video
        class="video-cell"
        ref="videoPlayer"
        :src="videoSrc"
        controls
      ></video>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"

const videoPlayer = ref()
const isVideoReady = ref(false)
const retryCount = ref(0)
const MAX_RETRIES = 3

const props = defineProps({
  videoSrc: {
    type: String,
    required: true
  }
})

onMounted(() => {
  const video = videoPlayer.value
  
  const initVideo = () => {
    // 强制预加载
    video.preload = 'auto'
    
    // 创建一个预加载的 XMLHttpRequest
    const xhr = new XMLHttpRequest()
    xhr.open('GET', props.videoSrc, true)
    xhr.responseType = 'blob'
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const videoBlob = xhr.response
        video.src = URL.createObjectURL(videoBlob)
        
        video.addEventListener('loadedmetadata', () => {
          video.currentTime = 0
          isVideoReady.value = true
          
          setTimeout(() => {
            video.play().catch(err => {
              console.log('Auto-play prevented:', err)
            })
          }, 300)
        })
      } else {
        retryInitialization()
      }
    }
    
    xhr.onerror = retryInitialization
    xhr.send()
  }

  const retryInitialization = () => {
    if (retryCount.value < MAX_RETRIES) {
      retryCount.value++
      console.log(`Retrying video initialization (${retryCount.value}/${MAX_RETRIES})`)
      setTimeout(initVideo, 1000) // 延迟1秒后重试
    }
  }

  // 初始化视频
  initVideo()

  // 清理函数
  onBeforeUnmount(() => {
    if (video.src.startsWith('blob:')) {
      URL.revokeObjectURL(video.src)
    }
  })
})
</script>

<style lang="scss" scoped>
  @use 'index';
</style>
