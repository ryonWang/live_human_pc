<template>
  <div class="form-cell">
    <div class="label">说话语速</div>
    <div class="pt24 slider-cell">
      <el-slider v-model="model.voice_speed" :min="0.5" :max="2" :step="0.1" @change="changeSpeed" />
      <p>{{ model.voice_speed }}</p>
    </div>
    <div class="label">音量调整</div>
    <div class="pt24 slider-cell">
      <el-slider v-model="model.voice_volume" :min="0.5" :max="5" :step="0.1" @change="changeVolume" />
      <p>{{ model.voice_volume }}</p>
    </div>
    <div class="label">选择声音</div>
    <div class="select-voice pt24">
      <div class="top">
        <el-input placeholder="关键字搜索" v-model="voiceName" class="input" style="width: 292px" @keydown="handleKeyDown">
          <template #suffix>
            <el-icon style="cursor: pointer" @click="currentChange(1)" :size="20">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <div class="type-cell">
          <div class="type-item active">
            公共
          </div>
        </div>
      </div>

      <div class="type-cell list" v-loading="loading">
        <div v-for="item in topList" :key="item.id" class="type-item"
          :class="{ active: model.voice_id === item.id && model.voice_material_type === item.type }"
          @click="selectVoice(item)">
          <p>{{ item.name }}</p>
          <svg v-if="currentVoiceId === item.id && currentVoiceType === item.type" @click="playVoice(item)" class="icon"
            aria-hidden="true">
            <use xlink:href="#icon-pause" />
          </svg>
          <svg v-else @click="playVoice(item)" class="icon" aria-hidden="true">
            <use xlink:href="#icon-play" />
          </svg>
        </div>
      </div>
    </div>
    <div class="pt32">
      <div class="type-cell" style="justify-content: flex-end">
        <div v-if="total > 6" class="more-btn" @click="dialog = true">
          <p>更多</p>
          <img src="@/assets/images/ai-video/icon_more.png" alt="">
        </div>
      </div>
    </div>
    <el-dialog v-model="dialog" :show-close="false" class="text-dialog global-dialog">
      <template #header="{ close, titleId, titleClass }">
        <div class="dialog-header">
          <el-input v-model="voiceName" placeholder="请输入搜索关键词" class="input" style="width: 50%"
            @keydown="handleKeyDown">
            <template #append>
              <el-button @click="currentChange(1)" :icon="Search" />
            </template>
          </el-input>
          <div class="type-cell">
            <div class="type-item active">
              公共
            </div>
          </div>
          <div class="flex1"></div>
          <svg class="icon close-btn" @click="dialog = false" aria-hidden="true">
            <use xlink:href="#icon-close" />
          </svg>
        </div>
      </template>
      <div class="form-cell">
        <div class="select-voice">
          <div class="type-cell list" v-loading="loading">
            <div v-for="item in list" :key="item.id" class="type-item"
              :class="{ active: model.voice_id === item.id && model.voice_material_type === item.type }"
              @click="selectVoice(item)">
              <p>{{ item.name }}</p>
              <svg v-if="currentVoiceId === item.id && currentVoiceType === item.type" @click="playVoice(item)"
                class="icon" aria-hidden="true">
                <use xlink:href="#icon-pause" />
              </svg>
              <svg v-else @click="playVoice(item)" class="icon" aria-hidden="true">
                <use xlink:href="#icon-play" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <el-pagination layout="total, prev, pager, next" hide-on-single-page :total="total" :current-page="current"
          :page-size="size" @current-change="currentChange" />
      </div>
      <div class="btn-cell">
        <div class="cancel-btn" @click="dialog = false">取消</div>
        <div class="confirm-btn" @click="dialog = false">确认</div>
      </div>
    </el-dialog>
    <audio :src="audioSrc" ref="audioPlayer" @ended="playEnd"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { Search } from '@element-plus/icons-vue'
import http from '@/utils/http'
const model = defineModel()
const topList = ref([])
const list = ref([])
const dialog = ref(false)
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const size = ref(10)
const voiceName = ref('')
const currentVoiceId = ref(0)
const currentVoiceType = ref(0)
const audioSrc = ref('')
const audioPlayer = ref()
onMounted(() => {
  getList()
})
const currentChange = (e) => {
  current.value = e
  getList()
}
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    currentChange(1)
  }
}
const getList = () => {
  loading.value = true
  http({
    url: http.adornUrl('/digital-human-voices/'),
    method: 'get',
    params: http.adornParams({
      page: current.value,
      page_size: size.value,
      name: voiceName.value
    })
  }).then(({ data }) => {
    list.value = data.items
    if (model.value.voice_id) {
      const tempIndex = data.items.findIndex(e => e.id === model.value.voice_id && e.type === model.value.voice_material_type)
      if (tempIndex >= 0 && tempIndex < 6) {
        topList.value = data.items.slice(0, 6)
      } else {
        const currentIndex = topList.value.findIndex(e => e.id === model.value.voice_id && e.type === model.value.voice_material_type)
        topList.value = [topList.value[currentIndex], ...data.items.slice(0, 5)]
      }
    } else {
      topList.value = data.items.slice(0, 6)
    }
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}
const selectVoice = (item) => {
  model.value.voice_id = item.id
  model.value.voice_material_type = item.type
  model.value.voice_download_url = item.file_path
  model.value.voice_npy_prompt_text = item.npy_prompt_text
  model.value.voice_voice_id = item.voice_id
  if (!topList.value.find(e => e.id === item.id && e.type === item.type)) {
    topList.value.pop()
    topList.value.unshift(item)
  }
}
const playEnd = () => {
  currentVoiceId.value = 0
  audioSrc.value = '';
}
const playVoice = async (item) => {
  // 播放语音
  if (currentVoiceId.value === item.id && currentVoiceType.value === item.type) {
    audioPlayer.value.pause()
    currentVoiceId.value = 0
    audioSrc.value = '';
  } else {
    audioSrc.value = item.sample_audio_url;
    currentVoiceId.value = item.id
    currentVoiceType.value = item.type
    // 等待音频加载完成后再设置属性
    audioPlayer.value.addEventListener('loadedmetadata', () => {
      audioPlayer.value.playbackRate = model.value.voice_speed
      audioPlayer.value.volume = model.value.voice_volume > 1 ? 1 : model.value.voice_volume
      audioPlayer.value.play()
    }, { once: true })  // 使用 once 选项确保事件监听器只触发一次
  }
}
const changeVolume = (e) => {
  audioPlayer.value.volume = e
}
const changeSpeed = (e) => {
  audioPlayer.value.playbackRate = e
}
</script>
<style lang="scss" scoped>
@use '../index';
</style>
