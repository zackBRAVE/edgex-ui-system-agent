import * as Config from '@/config'
import axios from 'axios'

/**
 * 封装post请求
 * @param path
 * @param data
 * @param success
 * @param error
 * @param final
 */
export const post = function (path, data, success, error, final) {
  return axios
    .post(path, data, Config.config)
    .then(res => {
      console.log('post', res)
      if (res.data.success) {
        success(res.data.content)
      } else {
        error(res.data.message)
      }
    })
    .catch(err => {
      error(err)
    })
    .finally(() => {
      if (typeof final === 'function') final()
    })
}

/**
 * 封装get请求
 * @param path
 * @param success
 * @param error
 * @param final
 */
export const get = function (path, success, error, final) {
  return axios
    .get(path, Config.config)
    .then(res => {
      if (res.status.toString().startsWith('2')) {
        success(res.data)
      } else {
        error(res.statusText)
      }
    })
    .catch(err => {
      error(err)
    })
    .finally(() => {
      if (typeof final === 'function') final()
    })
}
