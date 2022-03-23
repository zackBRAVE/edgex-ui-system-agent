<template>
  <div class="card service-list">
    <div class="card-header header">
      <span> <i class="bi bi-card-list pe-2"></i>System Services List</span>
      <button type="button" class="btn btn-primary" @click="refreshServices">
        <span> <i class="bi bi-arrow-clockwise pe-1"></i>{{ refreshMsg }} </span>
      </button>
    </div>

    <div class="card-body">
      <table class="table table-hover table-striped table-borderless">
        <thead class="table-light">
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>Metric</th>
            <th>Config</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          <SystemService
            v-for="service in serviceStates"
            :key="service.name"
            :data="service"
          ></SystemService>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import SystemService from '@/components/SystemService.vue'
import { getAllServices, getHealthState } from '@/api/system-agent'

let ServiceInfo = function (id, host, port) {
  this.id = id
  this.host = host
  this.port = port
}

let ServiceState = function (name, statusCode, apiVersion) {
  this.name = name
  this.statusCode = statusCode
  this.apiVersion = apiVersion
}

export default {
  name: 'ServiceList',
  components: {
    SystemService,
  },
  setup() {},
  data() {
    return {
      refreshMsg: 'Refresh',
      loadingMsg: 'Loading...',
      refreshDone: null,
      refreshFailed: null,
      hideRefreshMsg: null,
      services: '',
      serviceInfos: [],
      serviceStates: [],
    }
  },
  created() {
    this.initServices()
  },
  mounted() {
    this.refreshDone = this.createAlert('refresh succeeded!', 'success')
    this.refreshFailed = this.createAlert('refresh failed!', 'danger')
    this.hideRefreshMsg = this.debounce(() => {
      this.refreshDone.hide()
      this.refreshFailed.hide()
    }, 1500)
  },
  methods: {
    initServices() {
      this.updateServiceInfo()
        .then(() => {
          return this.updateServiceState()
        })
        .catch(error => {
          console.log('init failed!', error)
        })
    },
    refreshServices(event) {
      let _this = this

      let button = event.target
      button.innerText = _this.loadingMsg
      button.disabled = true

      _this
        .updateServiceState()
        .then(() => {
          _this.refreshDone.show()
        })
        .catch(() => {
          _this.refreshFailed.show()
        })
        .finally(() => {
          button.innerText = _this.refreshMsg
          button.disabled = false
          _this.hideRefreshMsg()
        })
    },
    updateServiceInfo() {
      let _this = this
      let serviceInfos = []
      let services = ''

      return getAllServices(
        data => {
          data.forEach(function (service) {
            let serviceInfo = new ServiceInfo(service.ServiceId, service.Host, service.Port)
            serviceInfos.push(serviceInfo)
          })
        },
        error => {
          console.log('update service info failed:', error)
        },
        () => {
          serviceInfos.forEach(function (serviceInfo) {
            services += serviceInfo.id + ','
          })
          services = services.slice(0, services.lastIndexOf(','))
          _this.serviceInfos = serviceInfos
          _this.services = services
        }
      )
    },
    updateServiceState() {
      let _this = this
      let serviceStates = []

      return getHealthState(
        _this.services,
        data => {
          data.forEach(function (service) {
            let serviceState = new ServiceState(
              service.serviceName,
              service.statusCode,
              service.apiVersion
            )
            serviceStates.push(serviceState)
          })
        },
        error => {
          console.log('get health state error:', error)
        },
        () => {
          _this.serviceStates = serviceStates
        }
      )
    },
  },
}
</script>

<style scoped>
.service-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding: 0 20px;
  background-color: #f5f5f5;
}

.card-body {
  margin: 0;
  padding: 0;
  width: 100%;
}

table {
  margin: 0;
}

.table-light {
  --bs-table-bg: rgba(236, 236, 236, 0.95);
}

.table {
  --bs-table-striped-bg: rgba(0, 0, 0, 0.02);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
</style>
