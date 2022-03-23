import * as Config from '@/config'
import { post, get } from '@/api/http-request' // eslint-disable-line no-unused-vars

const endpoint = '/sys-mgmt-agent'
const version2 = '/api/v2'
const urlPrefixV2 = `${Config.HTTP_SERVER}${endpoint}${version2}`
const allRegisteredSvcUrl = `${Config.HTTP_SERVER}/api/v2/registercenter/service/all`
const healthUrl = `${urlPrefixV2}/system/health`
// const configUrl = `${urlPrefixV2}/system/config`
// const metricsUrl = `${urlPrefixV2}/system/metrics`
// const operationUrl = `${urlPrefixV2}/system/operation`

export function getAllServices(success, error, final) {
  return get(allRegisteredSvcUrl, success, error, final)
}

export function getHealthState(services, success, error, final) {
  return get(`${healthUrl}?services=${services}`, success, error, final)
}

export function ping() {
  const pingUrl = `${Config.HTTP_SERVER}${endpoint}${version2}/ping`
  get(
    pingUrl,
    msg => {
      console.log('ping', msg)
    },
    msg => {
      console.log('ping', msg)
    }
  )
}
