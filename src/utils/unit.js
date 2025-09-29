import http from './http'
import { readFile } from '@tauri-apps/plugin-fs';
import axios from 'axios'
const unit = {
  getPreSignUrl: (params) => {
    const fileName = params.fileName.split(/[/\\]/).pop()
    return new Promise((resolve, reject) => {
      http({
        url: http.adornUrl('/file-deal/get_preSign_url'),
        method: 'get',
        params: http.adornParams({
          code: params.code,
          filename: fileName
        })
      }).then(({ data }) => {
        resolve(data.preSignUrl)
      }).catch(() => {
        reject(false)
      })
    })
  },
  uploadFile: async (params) => {
    const preSignUrl = await unit.getPreSignUrl(params)
    let file = null
    let contentType = unit.getContentType(params.fileName, params.fileType)
    if (import.meta.env.VITE_APP_IS_TAURI === 'true') { 
      file = await readFile(params.fileName)
    } else {
      file = params.file
    }
    return new Promise((resolve, reject) => {
      axios({
        url: preSignUrl,
        method: 'put',
        headers: {
          'Content-Type': contentType
        },
        data: file
      }).then(() => {
        resolve(preSignUrl.split('?')[0])
      }).catch((error) => {
        reject(error)
      })
    })
  },
  // 根据文件名转换contentType
  getContentType: (fileName, type) => {
    const ext = fileName.split('.').pop()
    return `${type}/${ext}`
  }
}
export default unit