<template>
  <div class="menu-box">
    <el-menu
      router
      unique-opened
      :default-active="route.meta.index"
    >
      <template
        v-for="(item, index) in menuList"
        :key="index"
      >
        <el-sub-menu
          v-if="item.children"
          :index="item.url"
        >
          <template #title>
            <svg class="icon icon-menu" aria-hidden="true">
              <use :xlink:href="item.icon" />
            </svg>
            <span>{{ item.name }}</span>
            <svg class="icon custom-arrow" aria-hidden="true">
              <use xlink:href="#icon-arrow" />
            </svg>
          </template>
          <el-menu-item
            v-for="menu in item.children"
            :key="menu.url"
            :index="menu.url"
          >
            <template #title>
              <span>{{ menu.name }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item
          v-else
          :index="item.url"
        >
          <template #title>
            <svg class="icon icon-menu" aria-hidden="true">
              <use :xlink:href="item.icon" />
            </svg>
            <span>{{ item.name }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>

    <el-dropdown
      class="system-cell"
      placement="top"
      @command="handleCommand"
    >
      <div class="user-cell">
        <img src="@/assets/images/icon/default_head.png" alt="">
        <p>{{userInfo.nickName}}</p>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="signOut">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router"
import { ref, reactive, onMounted } from "vue"
const route = useRoute()
const router = useRouter()
const menuList = reactive([
  {
    name: 'AI克隆',
    url: '/AIClone',
    icon: '#icon-menu_clone',
    children: [
      {
        name: '人物克隆',
        url: '/characterList',
      },
      {
        name: '声音克隆',
        url: '/voiceList',
      }
    ]
  },
  {
    name: 'AI短视频',
    url: '/AIVideo',
    icon: '#icon-menu_video',
    children: [
      {
        name: '生成口播',
        url: '/generateOralBroadcast',
      },
      {
        name: '视频列表',
        url: '/videoList',
      }
    ]
  }
])
const userInfo = ref({
  nickName: 'AI数字人系统矩阵'
})
const handleCommand = (command) => {
  if (command === 'signOut') {
    signOut()
  }
}
const signOut = () => {
  localStorage.clear()
  router.replace({
    path: '/login'
  })
}
</script>
<style lang="scss" scoped>
@import "@/styles/_variables";
.menu-box {
  min-height: $--full-height;
  padding-bottom: 80px;
  box-sizing: border-box;
  background: #252528;
  position: relative;
  .icon-menu {
    font-size: 12px;
    margin-right: 14px;
  }
  .custom-arrow {
    position: absolute;
    top: 50%;
    right: 44px;
    font-size: 20px;
    transition: transform 0.3s;
    transform: translateY(-50%);
  }
  ::v-deep .el-menu {
    border-right: none;
    .el-sub-menu.is-opened {
      .el-sub-menu__title {
        background: #343337;
        color: rgba(92, 218, 253, 1);
        .custom-arrow {
          transform: translateY(-50%) rotateZ(180deg);
        }
      }
    }
    .el-sub-menu__icon-arrow {
      display: none;
    }
    .el-sub-menu__title:hover {
      background: none;
      color: #1F80BD;
    }
    .el-menu-item:hover {
      background: none;
      color: #1F80BD;
    }
  }
  .system-cell {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 24px;
  }
  .user-cell {
    padding-left: 32px;
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
    &:focus-visible {
      outline: none;
    }
    img {
      width: 32px;
      height: 32px;
      display: block;
      border-radius: 50%;
    }
    p {
      padding-left: 16px;
      font-size: 12px;
      font-weight: 400;
    }
  }
}

@media (max-width: 1600px) {
  .menu-box {
    padding-bottom: 80px;
    .icon-menu {
      margin-right: 8px;
    }
    .custom-arrow {
      right: 14px;
      font-size: 16px;
    }
    .user-cell {
      padding-left: 20px;
      img {
        width: 24px;
        height: 24px;
      }
      p {
        padding-left: 14px;
      }
    }
  }
}
</style>
