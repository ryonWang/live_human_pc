<template>
  <div class="form-cell">
    <div class="label">选择人物</div>
    <div class="pt24">
      <div class="type-cell">
        <div
          :class="{active: type === 1}"
          @click="changeType(1)"
          class="type-item"
        >
          个人
        </div>
        <div
          :class="{active: type === 0}"
          @click="changeType(0)"
          class="type-item"
        >
          公共
        </div>
      </div>
    </div>
    <div class="img-list" v-loading="loading">
      <div
        class="img-item character-item"
        v-for="item in topList"
        :key="item.id"
        :class="{active: model.digital_human_avatars_id === item.id && model.digital_human_avatars_type === item.type}"
        @click="selectCharacter(item)"
      >
        <img :src="item.no_green_cover_image_path" alt="">
        <div class="img-name">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="pt32">
      <div
        class="type-cell"
        style="justify-content: flex-end"
        v-if="total > 9"
      >
        <div class="more-btn" @click="dialog = true">
          <p>更多</p>
          <img src="@/assets/images/ai-video/icon_more.png" alt="">
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialog"
      :show-close="false"
      class="text-dialog global-dialog"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="dialog-header">
          <el-input
            v-model="name"
            placeholder="人物名称"
            class="input"
            style="width: 50%"
            @keydown="handleKeyDown"
          >
            <template #append>
              <el-button @click="currentChange(1)" :icon="Search" />
            </template>
          </el-input>
          <div class="type-cell">
            <div
              :class="{active: type === 1}"
              @click="changeType(1)"
              class="type-item"
            >
              个人
            </div>
            <div
              :class="{active: type === 0}"
              @click="changeType(0)"
              class="type-item"
            >
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
        <div class="label">人物选择</div>
        <div class="img-list" v-loading="loading">
          <div
            v-for="item in list"
            :key="item.id"
            class="img-item"
            :class="{active: model.digital_human_avatars_id === item.id && model.digital_human_avatars_type === item.type}"
            @click="selectCharacter(item)"
          >
            <img :src="item.no_green_cover_image_path" alt="">
            <div class="img-name">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <el-pagination
          layout="total, prev, pager, next"
          hide-on-single-page
          :total="total"
          :current-page="current"
          :page-size="size"
          @current-change="currentChange"
        />
      </div>
      <div class="btn-cell">
        <div class="cancel-btn" @click="dialog = false">取消</div>
        <div class="confirm-btn" @click="dialog = false">确认</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { Search } from '@element-plus/icons-vue'
import http from '@/utils/http'
const model = defineModel()
const dialog = ref(false)
const loading = ref(false)
const topList = ref([])
const type = ref(1)
const list = ref([])
const total = ref(0)
const current = ref(1)
const size = ref(10)
const name = ref('')
onMounted(() => {
  getList()
})
const changeType = (e) => {
  type.value = e
  currentChange(1)
}
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    currentChange(1)
  }
}
const currentChange = (e) => {
  current.value = e
  getList()
}
const getList = () => {
  loading.value = true
  if (type.value === 1) {
    http({
      url: http.adornUrl('/digital-human-avatars/'),
      method: 'get',
      params: http.adornParams({
        page: current.value,
        page_size: size.value,
        name: name.value,
        status: 1,
        type: 1
      })
    }).then(({ data }) => {
      list.value = data.items
      if (model.value.digital_human_avatars_id) {
        const tempIndex = data.items.findIndex(e => e.id === model.value.digital_human_avatars_id)
        if (tempIndex >= 0 && tempIndex < 9) {
          topList.value = data.items.slice(0, 9)
        } else {
          const currentIndex = topList.value.findIndex(e => e.id === model.value.digital_human_avatars_id)
          topList.value = [topList.value[currentIndex], ...data.items.slice(0, 8)]
        }
      } else {
        topList.value = data.items.slice(0, 9)
      }
      total.value = data.total
    }).finally(() => {
      loading.value = false
    })
  } else {
    http({
      url: http.adornUrl('/digital-human-avatars/'),
      method: 'get',
      params: http.adornParams({
        page: current.value,
        page_size: size.value,
        name: name.value,
        status: 1,
        type: 0
      })
    }).then(({ data }) => {
      list.value = data.items
      if (model.value.digital_human_avatars_id) {
        const tempIndex = data.items.findIndex(e => e.id === model.value.digital_human_avatars_id && e.type === model.value.digital_human_avatars_type)
        if (tempIndex >= 0 && tempIndex < 9) {
          topList.value = data.items.slice(0, 9)
        } else {
          const currentIndex = topList.value.findIndex(e => e.id === model.value.digital_human_avatars_id && e.type === model.value.digital_human_avatars_type)
          topList.value = [topList.value[currentIndex], ...data.items.slice(0, 8)]
        }
      } else {
        topList.value = data.items.slice(0, 9)
      }
      total.value = data.total
    }).finally(() => {
      loading.value = false
    })
  }
}
const selectCharacter = (item) => {
  model.value.digital_human_avatars_id = item.id
  model.value.digital_human_avatars_type = item.type
  model.value.no_green_cover_image_path = item.no_green_cover_image_path
  model.value.digital_human_avatars_no_green_cover_image_width = item.no_green_cover_image_width
  model.value.digital_human_avatars_no_green_cover_image_height = item.no_green_cover_image_height
  model.value.digital_human_avatars_download_url = item.video_path
  model.value.digital_human_avatars_human_id = item.human_id
  if (!topList.value.find(e => e.id === item.id)) {
    topList.value.pop()
    topList.value.unshift(item)
  }
}
</script>

<style lang="scss" scoped>
  @use '../index';
</style>
