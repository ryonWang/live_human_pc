import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import VueDragResize from 'vue-drag-resize/src'
import '@/assets/fonts/iconfont.js'
import { createPinia } from 'pinia'
// 全局样式
import '@/styles/index.scss'
import App from './App.vue'
import router from '@/router'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const pinia = createPinia()
app.use(pinia)
app.component('vue-drag-resize', VueDragResize);
app.use(router)
app.mount('#app')
