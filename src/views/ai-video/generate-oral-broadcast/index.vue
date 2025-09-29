<template>
  <div class="page">
    <div class="left">
      <div class="preview-cell">
        <img class="bg" src="@/assets/images/ai-video/iphone_bg.png" alt="">
        <img class="tools" src="@/assets/images/ai-video/iphone_tools.png" alt="">
        <div
          class="preview-content"
          :class="{ horizontal: data.video_layout === 1}"
        >
          <vue-drag-resize
            v-if="avatarsShow && data.digital_human_avatars_switch === 1 && data.digital_human_avatars_id"
            :aspectRatio="true"
            :minw="10"
            :minh="10"
            :w="288"
            :h="avatarsHeight"
            :x="0"
            :y="0"
            @dragstop="characterResize"
            @resizestop="characterResize"
          >
            <img class="preview-bg" :src="data.no_green_cover_image_path" alt="">
          </vue-drag-resize>
          <vue-drag-resize
            v-if="data.subtitle_switch === 1"
            :minw="10"
            :minh="2"
            :maxh="48"
            :w="216"
            :x="fontPosition[0]"
            :y="fontPosition[1]"
            :h="data.font_size"
            @dragstop="captionsResize"
            @resizing="captionsResize"
          >
            <p
              class="preview-text"
              :style="{
                fontFamily: data.font_name,
                color: data.font_color,
                fontSize: data.font_size + 'px'
              }"
            >
              这是一段很长的字幕，是由文案区生成的
            </p>
          </vue-drag-resize>
        </div>
      </div>
    </div>
    <div class="right">
      <generate type="broadcast" v-model="data"/>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import generate from '@/components/generate/index.vue'
const data = ref({
  script_content: '',
  video_title: '',
  digital_human_avatars_switch: 1,
  digital_human_avatars_id: 0,
  digital_human_avatars_type: 0, // 0-公共 1-个人
  digital_human_avatars_position: "0,0",
  digital_human_avatars_scale: 1,
  digital_human_avatars_download_url: '',
  digital_human_avatars_human_id: 0,
  digital_human_avatars_no_green_cover_image_height: 0,
  digital_human_avatars_no_green_cover_image_width: 0,
  voice_speed: 1.1,
  voice_volume: 1.1,
  voice_path: '',
  voice_download_url: '',
  voice_npy_prompt_text: '',
  voice_voice_id: '',
  font_path: '',
  font_name: '',
  font_size: 12,
  font_color: '#ffffffff',
  font_position: '32,444,40'
})
const avatarsPosition = ref([0, 0])
const avatarsWidth = ref(0)
const avatarsHeight = ref(0)
const fontPosition = ref([32, 444, 40])
const avatarsShow = ref(true)
watch(() => data.value.digital_human_avatars_id, (newValue, oldValue) => {
  avatarsShow.value = false
  avatarsWidth.value = 288
  avatarsHeight.value = data.value.digital_human_avatars_no_green_cover_image_height / data.value.digital_human_avatars_no_green_cover_image_width * 288
  data.value.digital_human_avatars_scale = avatarsWidth.value / data.value.digital_human_avatars_no_green_cover_image_width  /  scaleDesc()
  setTimeout(() => {
    avatarsShow.value = true
  }, 100)
}, {deep: true})
const characterResize = (e) => {
  avatarsPosition.value = [e.left, e.top]
  const temp1 = [e.left / scaleDesc(), e.top / scaleDesc() ]
  data.value.digital_human_avatars_position = temp1.join(',')
  avatarsWidth.value = e.width
  data.value.digital_human_avatars_scale = avatarsWidth.value / data.value.digital_human_avatars_no_green_cover_image_width  /  scaleDesc()
}
const scaleDesc = () => {
  return  512 / 1920
}
const captionsResize = (e) => {
  fontPosition.value = [e.left, e.top, 288-e.left-e.width]
  data.value.font_position = fontPosition.value.join(',')
}
</script>

<style lang="scss" scoped>
  @use 'index';
</style>
