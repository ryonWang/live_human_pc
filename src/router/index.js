import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/index.vue'
import Login from '@/views/login/index.vue'

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: {
      title: '登录'
    }
  }
]

export const mainRoutes = {
  path: '/',
  component: Index,
  name: 'Index',
  redirect: '/login',
  children: [
    {
      path: '/characterClone',
      name: 'characterClone',
      component: () => import('@/views/ai-clone/character/index.vue'),
      meta: {
        index: '/characterList'
      }
    },
    {
      path: '/characterList',
      name: 'characterList',
      component: () => import('@/views/ai-clone/character/list.vue'),
      meta: {
        index: '/characterList'
      }
    },
    {
      path: '/voiceList',
      name: 'voiceList',
      component: () => import('@/views/ai-clone/voice/list.vue'),
      meta: {
        index: '/voiceList'
      }
    },
    {
      path: '/videoList',
      name: 'videoList',
      component: () => import('@/views/ai-video/list/index.vue'),
      meta: {
        index: '/videoList'
      }
    },
    {
      path: '/generateOralBroadcast',
      name: 'generateOralBroadcast',
      component: () => import('@/views/ai-video/generate-oral-broadcast/index.vue'),
      meta: {
        index: '/generateOralBroadcast'
      }
    }
  ]
}
const router = createRouter({
  history: import.meta.env.VITE_APP_IS_TAURI == 'true' ? createWebHistory() : createWebHistory('/pc/'),
  scrollBehavior: () => ({ top: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})
/**
 * 路由错误处理
 */
router.onError((error, to, from) => {
  if (/dynamically imported module|Unable to preload CSS for/.test(error)) {
    window.history.pushState({}, '', to.path)
    window.location.reload()
  }
})
export default router
