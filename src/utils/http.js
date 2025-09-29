import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import merge from 'lodash/merge'
import { ElMessage } from 'element-plus'

const http = axios.create({
  timeout: 1000 * 60,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(
  config => {
    // 只针对get方式进行序列化
    if (config.method === 'get' || config.method === 'GET') {
      config.paramsSerializer = {
        serialize: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截
 */
http.interceptors.response.use(
  response => {
    // blob 格式处理
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return response
    }
    const res = response.data
    // 200 请求成功
    if (res.code === 200) {
      return res
    }
    // 401 TOKEN失效
    if (res.code === 401) {
      localStorage.removeItem('userInfo')
      localStorage.removeItem('TOKEN')
      ElMessage({
        message: res.message || '未登录',
        type: 'error',
        duration: 1500,
        customClass: 'element-error-message-zindex'
      })
      // router.replace({
      //   path: '/login'
      // })
      return Promise.reject(res)
    }
    // 500 用于直接显示提示用户的错误,内容由输入决定
    if (res.code === 500) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 1.5 * 1000
      })
      return Promise.reject(res)
    }

    if (res.code !== 200) {
      ElMessage({
        message: res.message || res.data || 'Error',
        type: 'error',
        duration: 1.5 * 1000
      })
      return Promise.reject(res)
    }
  },
  error => {
    // eslint-disable-next-line no-console
    console.log('========请求失败========', '\n', error, '\n', '========请求失败 end========')
    
    ElMessage({
      message: '请求异常',
      type: 'error',
      duration: 1500,
      customClass: 'element-error-message-zindex'
    })
    return Promise.reject(error)
  }
)

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = actionName => {
  return import.meta.env.VITE_APP_BASE_API + actionName
}
/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  const defaults = {
    t: Date.now()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  const defaults = {
    t: Date.now()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
