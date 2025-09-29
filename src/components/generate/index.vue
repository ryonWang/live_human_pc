<template>
  <div class="generate-cell">
    <el-tabs
      tab-position="right"
      class="tab-list"
      v-model="curTab"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.type"
        :name="item.type"
      >
        <template #label>
          <div
            class="tab-item"
            :class="{active: curTab === item.type}"
          >
            <img :src="curTab === item.type?item.activeIcon:item.icon" alt="">
            <p>{{item.label}}</p>
          </div>
        </template>
        <div class="tab-content">
          <component
            :is="item.content"
            v-model="model"
            :type="props.type"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="generate-btn" @click="generateVerification">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-generate" />
      </svg>
      <p>生成</p>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from "vue"
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from "vue-router"
import http from '@/utils/http'
import tab_text from "@/assets/images/ai-video/tab_text.png"
import tab_text_select from "@/assets/images/ai-video/tab_text_select.png"
import tab_character from "@/assets/images/ai-video/tab_character.png"
import tab_character_select from "@/assets/images/ai-video/tab_character_select.png"
import tab_voice from "@/assets/images/ai-video/tab_voice.png"
import tab_voice_select from "@/assets/images/ai-video/tab_voice_select.png"
import tab_captions from "@/assets/images/ai-video/tab_captions.png"
import tab_captions_select from "@/assets/images/ai-video/tab_captions_select.png"
import tabText from '@/components/generate/components/text.vue'
import character from '@/components/generate/components/character.vue'
import voice from '@/components/generate/components/voice.vue'
import captions from '@/components/generate/components/captions.vue'
const router = useRouter()
const props = defineProps({
  type: {
    type: String,
    required: true
  }
})
const model = defineModel()
const curTab = ref('text')
const tabList =  [
  {
    label: '文案',
    type: 'text',
    icon: tab_text,
    activeIcon: tab_text_select,
    content: markRaw(tabText)
  },
  {
    label: '人物',
    type: 'character',
    icon: tab_character,
    activeIcon: tab_character_select,
    content: markRaw(character)
  },
  {
    label: '配音',
    type: 'voice',
    icon: tab_voice,
    activeIcon: tab_voice_select,
    content: markRaw(voice)
  },
  {
    label: '字幕',
    type: 'captions',
    icon: tab_captions,
    activeIcon: tab_captions_select,
    content: markRaw(captions)
  }
]
const loading= ref(false)
const colorDesc = (color) => {
  if (!color) return
  // 移除开头的#号
  const colorWithoutHash = color.replace('#', '')
  
  // 提取RGB和透明度部分
  const red = colorWithoutHash.slice(0, 2)
  const green = colorWithoutHash.slice(2, 4)
  const blue = colorWithoutHash.slice(4, 6)
  const alpha = colorWithoutHash.slice(6, 8)

  // 转换 alpha 值: FF->00, 00->FF
  const convertedAlpha = alpha ? (255 - parseInt(alpha, 16)).toString(16).padStart(2, '0').toUpperCase() : 'FF'

  // 重组颜色值为 FFRRGGBB 格式
  return convertedAlpha + blue + green + red
}
const generateVerification = () => {
  ElMessageBox.confirm(
    '您的视频预计10分钟内容生成完成，您确定马上开始吗？关闭页面不影响生成内容',
    '',
    {
      distinguishCancelAndClose: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  )
    .then(() => {
      generateBroadcastFn()
    })
    .catch(() => {

    })
}
const generateBroadcastFn = () => {
  let params = JSON.parse(JSON.stringify(model.value))
  if (!params.script_content) {
    ElMessage({
      message: '请输入文案',
      type: 'warning',
      duration: 1.5 * 1000
    })
    return false
  }
  if (!params.video_title) {
    ElMessage({
      message: '请输入标题',
      type: 'warning',
      duration: 1.5 * 1000
    })
    return false
  }
  if (!params.digital_human_avatars_id) {
    ElMessage({
      message: '请选择人物',
      type: 'warning',
      duration: 1.5 * 1000
    })
    return false
  }
  if ((params.voice_switch === 0 && !params.voice_id) || (params.voice_switch === 1 && !params.voice_path)) {
    ElMessage({
      message: '请选择配音',
      type: 'warning',
      duration: 1.5 * 1000
    })
    return false
  }
  if(params.subtitle_switch === 1 && !params.font_path) {
    ElMessage({
      message: '请选择字体',
      type: 'warning',
      duration: 1.5 * 1000
    })
    return false
  }
  params.font_color = colorDesc(params.font_color)
  if (loading.value) {
    return false
  } else {
    loading.value = true
  }
  http({
    url: http.adornUrl('/video/create'),
    method: 'post',
    data: http.adornData(params)
  }).then((res) => {
    ElMessage({
      message: res.message,
      type: 'success',
      duration: 3 * 1000
    })
    router.push({
      path: '/videoList'
    })
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style lang="scss" scoped>
  @use 'index';
</style>
