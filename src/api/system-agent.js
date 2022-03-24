import * as Config from '@/config'
import { post, get } from '@/api/http-request' // eslint-disable-line no-unused-vars

const endpoint = '/sys-mgmt-agent'
const version2 = '/api/v2'
const apiVersion = 'v2'
const urlPrefixV2 = `${Config.HTTP_SERVER}${endpoint}${version2}`
const pingUrl = `${urlPrefixV2}/ping`
const allRegisteredSvcUrl = `${Config.HTTP_SERVER}/api/v2/registercenter/service/all`
const healthUrl = `${urlPrefixV2}/system/health`
const configUrl = `${urlPrefixV2}/system/config`
const metricsUrl = `${urlPrefixV2}/system/metrics`
const operationUrl = `${urlPrefixV2}/system/operation`

export function getAllServices(success, error, final) {
  return get(allRegisteredSvcUrl, success, error, final)
}

export function getHealthState(services, success, error, final) {
  return get(`${healthUrl}?services=${services}`, success, error, final)
}

export function getConfig(service, success, error, final) {
  return get(`${configUrl}?services=${service}`, success, error, final)
}

export function getMetrics(service, success, error, final) {
  return get(`${metricsUrl}?services=${service}`, success, error, final)
}

export function operation(name, op, success, error, final) {
  let body = JSON.stringify([
    {
      apiVersion: apiVersion,
      serviceName: name,
      action: op,
    },
  ])
  return post(
    `${operationUrl}`,
    body,
    res => {
      res = res[0]
      if (res.statusCode.toString().startsWith('2')) {
        success(res)
      } else {
        error(res?.message)
        throw res?.message
      }
    },
    err => {
      console.log('operation error:', err)
      error(err)
      throw err
    },
    final
  )
}

export function ping(success, error, final) {
  return get(pingUrl, success, error, final)
}
