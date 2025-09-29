<template>
  <div class="form-cell">
    <div class="switch-cell">
      <p>开启字幕</p>
      <el-switch
        v-model="model.subtitle_switch"
        style="--el-switch-on-color: #13ce66;"
        :active-value="1"
        :inactive-value="0"
      />
    </div>
    <div class="pt24">
      <div class="type-cell" v-loading="loading">
        <div
          v-for="item in topList"
          :key="item.id"
          :class="{active: model.font_name === item.name}"
          @click="selectFont(item)"
          class="type-item"
        >
          {{ item.nickname }}
        </div>
        <div
          v-if="total > 3"
          class="more-btn"
          @click="dialog = true"
        >
          <p>更多</p>
          <img src="@/assets/images/ai-video/icon_more.png" alt="">
        </div>
      </div>
    </div>
    <div class="label">字体大小</div>
    <div class="pt24 slider-cell">
      <el-slider v-model="model.font_size" :min="2" :max="48" :step="1"/>
      <p>{{ model.font_size }}</p>
    </div>
    <div class="label">字体颜色</div>
    <div class="pt24">
      <el-color-picker
        v-model="model.font_color"
        show-alpha
        color-format="hex"
        size="large"
      />
    </div>
    <el-dialog
      v-model="dialog"
      :show-close="false"
      class="text-dialog global-dialog"
    >
      <div class="form-cell">
        <div
          class="label"
          style="padding-top: 0;"
        >
          选择字体
        </div>
        <div class="type-cell" v-loading="loading">
          <div
            v-for="item in list"
            :key="item.id"
            :class="{active: model.font_name === item.name}"
            @click="selectFont(item)"
            class="type-item"
          >
            {{ item.nickname }}
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
import http from '@/utils/http'
const model = defineModel()
const topList = ref([])
const list = ref([])
const loading = ref(false)
const dialog = ref(false)
const total = ref(0)
const current = ref(1)
const size = ref(10)
onMounted(() => {
  getList()
})
const currentChange = (e) => {
  current.value = e
  getList()
}
const getList = () => {
  loading.value = true
  http({
    url: http.adornUrl('/font/'),
    method: 'get',
    params: http.adornParams({
      page: current.value,
      page_size: size.value
    })
  }).then(({ data }) => {
    list.value = data.items
    if (topList.value.length === 0) {
      topList.value = data.items.slice(0, 3)
    }
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}
const selectFont = (item) => {
  loadFont(item.name, item.font_path)
  model.value.font_name = item.name
  model.value.font_path = item.font_path
  if (!topList.value.find(e => e.name === item.name)) {
    topList.value.pop()
    topList.value.unshift(item)
  }
}
function loadFont(fontName, fontUrl) {
  const font = new FontFace(fontName, `url(${fontUrl})`)
  font.load().then((loadedFont) => {
    document.fonts.add(loadedFont)
  }).catch((error) => {
    console.error('字体加载失败:', error);
  });
}
</script>
<style lang="scss" scoped>
  @use '../index';
</style>
