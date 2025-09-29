<template>
  <div class="page">
    <div class="global-search-cell">
      <div class="search-item">
        <el-input
          v-model="name"
          placeholder="标题搜索"
          class="input"
          @keydown="handleKeyDown"
        >
          <template #suffix>
            <el-icon style="cursor: pointer" @click="currentChange(1)" :size="20">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
      <div class="search-item">
        <div class="label">生成时间：</div>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          :clearable="false"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          @change="currentChange(1)"
          class="datePicker"
        />
      </div>
    </div>
    <div class="table-cell">
      <el-table
        v-loading="loading"
        :data="list"
        :border="false"
        :row-class-name="tableRowClassName"
      >
        <template #empty>
          <div class="empty-block">
            <img src="@/assets/images/icon/empty.png" alt="暂无数据" class="empty-image">
            <p class="empty-text">暂无数据</p>
          </div>
        </template>
        <el-table-column
          prop="title"
          label="标题"
          min-width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="status"
          label="状态"
          min-width="170"
        >
          <template #default="scope">
            <div v-if="scope.row.status === 1" class="status-cell">
              <div class="point green"></div>
              <p>已生成</p>
            </div>
            <div v-else-if="scope.row.status === 0" class="status-cell">
              <div class="point orange"></div>
              <p>生成中</p>
            </div>
            <div v-else-if="scope.row.status === 2" class="status-cell">
              <div class="point red"></div>
              <p>生成失败，请重试</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="video_cover"
          label="视频"
          min-width="170"
        >
          <template #default="scope">
            <img
              v-if="scope.row.video_cover"
              class="video-cover"
              @click="previewVideoFn(scope.row.video_url)"
              :src="scope.row.video_cover"
              alt=""
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="开始时间"
          min-width="170"
        />
        <el-table-column
          prop="finished_at"
          label="生成时间"
          min-width="170"
        />
        <el-table-column
          label="操作"
          min-width="120"
        >
          <template #default="scope">
            <el-button
              link
              type="danger"
              @click="deleteVideo(scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-if="scope.row.video_url && isTauri === 'true'"
              link
              type="primary"
              @click="openFileLocation(scope.row.video_url)"
            >
              打开
            </el-button>
            <el-button
              v-if="scope.row.video_url && isTauri !== 'true'"
              link
              type="primary"
              @click="downloadVideo(scope.row.video_url)"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="total > size"
        class="pagination-box"
      >
        <div class="total">共{{total}}项数据</div>
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :current-page="current"
          :page-size="size"
          @current-change="currentChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="dialog"
      class="global-dialog"
      width="328px"
      :show-close="false"
      destroy-on-close
    >
      <previewVideo :videoSrc="videoSrc" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { ElMessageBox } from 'element-plus'
import { useRouter } from "vue-router"
const router = useRouter()
import http from '@/utils/http'
import dateUtil from '@/utils/date'
import dayjs from 'dayjs'
import { platform } from '@tauri-apps/plugin-os';
import { Command } from '@tauri-apps/plugin-shell';
import previewVideo from '@/components/preview-video/index.vue'
import { invoke } from '@tauri-apps/api/core'
const isTauri = import.meta.env.VITE_APP_IS_TAURI
const shortcuts = dateUtil.shortcuts
const dialog = ref(false)
const videoSrc = ref('')
const end = new Date()
const start = new Date()
start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
const dateRange = ref([dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')])
const list = ref([])
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const size = ref(10)
const name = ref('')
onMounted(() => {
  getList()
})
const downloadVideo = (filePath) => {
  console.log(filePath);
  http({
    url: http.adornUrl('/file-deal/download'),
    method: 'get',
    responseType: 'arraybuffer',
    params: http.adornParams({
      url: filePath
    })
  }).then(({ data }) => {
    const blob = new Blob([data], { type: 'video/mp4' })
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = blobUrl
    const fileName = filePath.split('/').pop() || 'video.mp4'
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  })
}
const previewVideoFn = (filePath) => {
  dialog.value = true
  videoSrc.value  = filePath;
}
const openFileLocation = async (filePath) => {
  try {
    // 获取Docker挂载路径
    const baseUrl = 'http://127.0.0.1:8000/data'
    const dockerMountPath = await invoke('get_docker_mount_path')
    
    console.log('Docker mount path:', dockerMountPath)
    
    // 将 HTTP URL 转换为实际的文件系统路径
    const relativePath = filePath.replace(baseUrl, '')
    const actualPath = `${dockerMountPath}${relativePath}`
    
    const currentPlatform = await platform()
    // Docker 路径使用正斜杠，需要根据平台转换为系统路径
    const normalizedPath = currentPlatform === 'windows' 
      ? actualPath.replace(/\//g, '\\')  // Docker路径转Windows路径
      : actualPath  // Unix系统保持不变，因为Docker已经使用/
    
    const folderPath = normalizedPath.substring(0, Math.max(
      normalizedPath.lastIndexOf('\\'),
      normalizedPath.lastIndexOf('/')
    ))

    if (currentPlatform === 'windows') {
      const command = new Command('explorer', [folderPath])
      await command.execute()
    } else {
      const command = new Command('open', [folderPath])
      await command.execute()
    }
  } catch (error) {
    console.error('打开文件夹失败:', error)
  }
}
const getList = () => {
  loading.value = true
  http({
    url: http.adornUrl('/short-videos/'),
    method: 'get',
    params: http.adornParams({
      page: current.value,
      page_size: size.value,
      name: name.value,
      start_time: dateRange.value[0] + ' 00:00:00',
      end_time: dateRange.value[1] + ' 23:59:59'
    })
  }).then(({ data }) => {
    list.value = data.items
    total.value = data.total
  }).finally(() => {
    loading.value = false
  })
}
const deleteVideo = (item) => {
  ElMessageBox.confirm(
    `您确定删除【${item.title}】吗？删除无法找回`,
    '删除',
    {
      distinguishCancelAndClose: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  )
    .then(() => {
      http({
        url: http.adornUrl(`/short-videos/${item.id}`),
        method: 'delete'
      }).then(({ data }) => {
        getList()
      })
    })
    .catch(() => {

    })
}
const currentChange = (e) => {
  current.value = e
  getList()
}
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    currentChange(1)
  }
}
const linkDetail = (item) => {
  if (item.type === 0) {
    router.push({
      path: '/generateOralBroadcast',
      query: {
        id: item.id
      }
    })
  } else if (item.type === 1) {
    router.push({
      path: '/generateMixedCutting',
      query: {
        id: item.id
      }
    })
  }
}
const tableRowClassName = ({row, rowIndex}) => {
  if (rowIndex % 2 === 0) {
    return 'dark'
  }
}

</script>

<style lang="scss" scoped>
  @use 'index';
</style>
