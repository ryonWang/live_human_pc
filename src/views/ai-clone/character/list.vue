<template>
  <div class="page">
    <div class="global-tab-list">
      <div
        class="item"
        :class="{'active': curTab === 1}"
        @click="changeTab(1)"
      >
        个人（{{ selfTotal }}个）
      </div>
      <div
        class="item"
        :class="{'active': curTab === 0}"
        @click="changeTab(0)"
      >
        公共
      </div>
    </div>
    <template v-if="curTab === 1">
      <div class="global-search-cell">
        <div class="search-item">
          <el-input
            v-model="selfName"
            placeholder="名称搜索"
            @keydown="handleKeyDown"
          >
            <template #prefix>
              <el-icon style="cursor: pointer" @click="selfCurrentChange(1)" :size="20">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="flex1"></div>
        <div class="refresh-cell" @click="getSelfList">
          <svg class="icon icon-refresh" aria-hidden="true">
            <use xlink:href="#icon-refresh" />
          </svg>
          <p>刷新</p>
        </div>
      </div>
      <div class="global-video-list" v-loading="selfLoading">
        <div class="item add-item" @click="addSelf">
          <svg class="icon icon-add" aria-hidden="true">
            <use xlink:href="#icon-add" />
          </svg>
          <p>添加形象</p>
        </div>
        <div
          class="item"
          v-for="item in selfList"
          :key="item.id"
        >
          <el-image
            v-if="item.status === 1"
            class="item-img"
            @click="previewVideo(item.welcome_video_path)"
            :src="item.no_green_cover_image_path"
            fit="cover"
          />
          <el-image
            v-else-if="item.status === 0"
            class="item-img"
            :src="creatingImg"
            fit="cover"
          />
          <div class="img-fail" v-else>
            <svg class="icon icon-fail" aria-hidden="true">
              <use xlink:href="#icon-img_fail" />
            </svg>
            <p>生成失败</p>
          </div>
          <div class="item-top">
            <div class="item-top-left">
              <div v-if="item.status === 0" class="view-cell blue">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-creating" />
                </svg>
                <p>生成中</p>
              </div>
              <div v-else-if="item.status === 1" class="view-cell green">
                <div class="point"></div>
                <p>已完成</p>
              </div>
              <div v-else-if="item.status === 2" class="view-cell red">
                <div class="point"></div>
                <p>生成失败</p>
              </div>
            </div>
            <div class="flex1"></div>
            <el-dropdown
              class="item-top-right"
              @command="(command) => handleCommand(command, item)"
            >
              <div class="more-cell">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-more" />
                </svg>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="delete">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="item-bottom">
            <div class="name">{{ item.name }}</div>
            <div class="time">{{ item.created_at }}</div>
          </div>
        </div>
      </div>
      <div
        v-if="selfTotal > selfSize"
        class="pagination-box"
      >
        <div class="total">共{{selfTotal}}项数据</div>
        <el-pagination
          layout="prev, pager, next"
          :total="selfTotal"
          :current-page="selfCurrent"
          :page-size="selfSize"
          @current-change="selfCurrentChange"
        />
      </div>
    </template>
    
    <template v-if="curTab === 0">
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
      <div class="global-video-list" v-loading="publicLoading">
        <div
         class="item" 
         v-for="item in publicList"
          :key="item.id" 
          @click="previewVideo(item.welcome_video_path)" 
        >
          <el-image class="item-img" :src="item.no_green_cover_image_path" fit="cover" />
          <div class="item-bottom">
            <div class="name">{{ item.name }}</div>
            <div class="time">{{ item.created_at }}</div>
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
    </template>
    <el-dialog
      v-model="dialog"
      class="global-dialog"
      width="400px"
      destroy-on-close
    >
      <video
        class="video-cell"
        ref="videoPlayer"
        :src="videoSrc"
        controls
      ></video>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import http from '@/utils/http'
import { ref, onMounted, nextTick } from "vue"
import { useRouter } from "vue-router"
import creatingImg from '@/assets/images/common/video_creating_img.png'
const dialog = ref(false)
const curTab = ref(1)
const selfName = ref('')
const selfLoading = ref(false)
const selfList = ref([])
const selfTotal = ref(0)
const selfCurrent = ref(1)
const selfSize = ref(10)
const publicName = ref('')
const publicLoading = ref(false)
const publicList = ref([])
const publicTotal = ref(0)
const publicCurrent = ref(1)
const publicSize = ref(10)
const videoSrc = ref('')
const videoPlayer = ref()
const router = useRouter()
onMounted(() => {
  getSelfList()
  getPublicList()
})
const changeTab = (tab) => {
  curTab.value = tab
}
const addSelf = () => {
  router.push('/characterClone')
}
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    if (curTab.value === 1) {
      selfCurrentChange(1)
    } else {
      publicCurrentChange(1)
    }
  }
}
const selfCurrentChange = (e) => {
  selfCurrent.value = e
  getSelfList()
}
const publicCurrentChange = (e) => {
  publicCurrent.value = e
  getPublicList()
}
const getSelfList = () => {
  selfLoading.value = true
  http({
      url: http.adornUrl('/digital-human-avatars/'),
      method: 'get',
      params: http.adornParams({
        page: selfCurrent.value,
        page_size: selfSize.value,
        name: selfName.value,
        type: 1
      })
    }).then(({ data }) => {
      selfList.value = data.items
      selfTotal.value = data.total
    }).finally(() => {
      selfLoading.value = false
    })
}
const getPublicList = () => {
  publicLoading.value = true
  http({
    url: http.adornUrl('/digital-human-avatars/'),
    method: 'get',
    params: http.adornParams({
      page: publicCurrent.value,
      page_size: publicSize.value,
      name: publicName.value,
      type: 0
    })
    }).then(({ data }) => {
      publicList.value = data.items
      publicTotal.value = data.total
    }).finally(() => {
      publicLoading.value = false
    })
}
const handleCommand = (command, item) => {
  if (command === 'delete') {
    deleteSelf(item)
  }
}
const deleteSelf = (item) => {
  ElMessageBox.confirm(
    `您确定删除【${item.name}】吗？删除无法找回`,
    '删除',
    {
      distinguishCancelAndClose: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  )
    .then(() => {
      http({
        url: http.adornUrl(`/digital-human-avatars/${item.id}`),
        method: 'delete'
      }).then(({ data }) => {
        getSelfList()
      })
    })
    .catch(() => {

    })
}
const previewVideo = (filePath) => {
  // 预览人物视频
  dialog.value = true
  videoSrc.value  = filePath
  nextTick(() => {
    videoPlayer.value.play()
  })
}
</script>
<style lang="scss" scoped>
  @use 'list';
</style>