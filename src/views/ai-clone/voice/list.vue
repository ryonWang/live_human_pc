<template>
  <div class="page">
    <div class="global-tab-list">
      <div
        class="item active"
      >
        公共
      </div>
    </div>
    
    <div class="global-search-cell">
        <div class="search-item">
          <el-input
            v-model="publicName"
            placeholder="名称搜索"
            @keydown="handleKeyDown"
          >
            <template #prefix>
              <el-icon style="cursor: pointer" @click="publicCurrentChange(1)" :size="20">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>
      <div class="voice-list" v-loading="publicLoading">
        <div class="item" v-for="item in publicList" :key="item.id">
          <div
            class="success-cell"
            @click="playVoice(item)"
          >
            <div class="left-cell">
              <svg
                v-if="currentVoiceId === item.id && currentVoiceType === curTab"
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#icon-pause" />
              </svg>
              <svg
                v-else
                class="icon"
                aria-hidden="true"
              >
                <use xlink:href="#icon-play" />
              </svg>
            </div>
            <div class="right-cell">
              <p class="voice-name ellipsis">{{ item.name }}</p>
              <p class="voice-time">{{ item.created_at }}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="publicTotal > publicSize"
        class="pagination-box"
      >
        <div class="total">共{{publicTotal}}项数据</div>
        <el-pagination
          layout="prev, pager, next"
          :total="publicTotal"
          :current-page="publicCurrent"
          :page-size="publicSize"
          @current-change="publicCurrentChange"
        />
      </div>
    <audio :src="audioSrc" ref="audioPlayer" @ended="playEnd"></audio>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import http from '@/utils/http'
import { ref, onMounted, nextTick } from "vue"
import { useRouter } from "vue-router"
const curTab = ref(0)
const publicName = ref('')
const publicLoading = ref(false)
const publicList = ref([])
const publicTotal = ref(0)
const publicCurrent = ref(1)
const publicSize = ref(10)
const currentVoiceId = ref(0)
const currentVoiceType = ref(1)
const audioSrc = ref('')
const audioPlayer = ref()
onMounted(() => {
  getPublicList()
})
const playVoice = (item) => {
   // 播放语音
   if (currentVoiceId.value === item.id && currentVoiceType.value === curTab.value) {
    audioPlayer.value.pause()
    currentVoiceId.value = 0
    audioSrc.value  = '';
  } else {
    audioSrc.value  = item.sample_audio_url
    currentVoiceId.value = item.id
    currentVoiceType.value = curTab.value
    nextTick(() => {
      audioPlayer.value.play()
    })
  }
}
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    publicCurrentChange(1)
  }
}
const publicCurrentChange = (e) => {
  publicCurrent.value = e
  getPublicList()
}
const getPublicList = () => {
  publicLoading.value = true
  http({
      url: http.adornUrl('/digital-human-voices/'),
      method: 'get',
      params: http.adornParams({
        page: publicCurrent.value,
        page_size: publicSize.value,
        name: publicName.value
      })
    }).then(({ data }) => {
      publicList.value = data.items
      publicTotal.value = data.total
    }).finally(() => {
      publicLoading.value = false
    })
}
</script>
<style lang="scss" scoped>
  @use 'list';
</style>