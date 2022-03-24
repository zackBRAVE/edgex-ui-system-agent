<template>
  <div v-if="agentDown" class="card text-dark bg-light">
    <div class="card-body mt-5 mb-5 ms-4 me-5 w-auto">
      <h4 class="card-title fw-bolder">Oops!!! system agent service is unavailable!</h4>
      <p class="card-text fs-5">
        This could be a network reason, or it could be that the system agent microservice is not
        running, make sure there is no network problem or that the system agent service is already
        running!
      </p>
      <hr />
      <p class="card-text fs-6">
        EdgeXFoundry uses a microservices architecture, each service is running independently,
        please make sure that the current service is already running, if you have manually started
        the service, click the Refresh button.
      </p>
      <button type="button" class="btn btn-primary" @click="reping">
        <span class="fw-bold"> <i class="bi bi-arrow-clockwise pe-1"></i>{{ refreshMsg }}</span>
      </button>
    </div>
  </div>

  <div v-else class="card service-list">
    <div class="card-header header">
      <span> <i class="bi bi-card-list pe-2"></i>System Services List</span>
      <button type="button" class="btn btn-primary" @click="refreshServices">
        <span class="fw-bold"> <i class="bi bi-arrow-clockwise pe-1"></i>{{ refreshMsg }} </span>
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
            @refresh-status="updateServiceState"
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
import { getAllServices, getHealthState, ping } from '@/api/system-agent'

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
      agentDown: false,
      refreshMsg: 'Refresh',
      refreshDone: null,
      refreshFailed: null,
      pingFailed: null,
      hideRefreshMsg: null,
      services: '',
      serviceInfos: [],
      serviceStates: [],
    }
  },
  created() {
    this.initServices()
    this.refreshDone = this.createAlert('refresh succeeded!', 'success')
    this.refreshFailed = this.createAlert('refresh failed!', 'danger')
    this.pingFailed = this.createAlert(
      'The system agent service is unavailable! Please check the service and try again.',
      'danger'
    )
    this.hideRefreshMsg = this.debounce(() => {
      this.refreshDone.hide()
      this.refreshFailed.hide()
      this.pingFailed.hide()
    }, 2000)
  },
  mounted() {},
  methods: {
    initServices() {
      this.ping()
        .then(() => {
          return this.updateServiceInfo()
        })
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
      _this.refreshMsg = 'Loading...'
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
          _this.refreshMsg = 'Refresh'
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
          serviceInfos = serviceInfos.sort(function (a, b) {
            return a.id < b.id ? -1 : 1
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
          serviceStates = serviceStates.sort(function (a, b) {
            return a.name < b.name ? -1 : 1
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
    ping() {
      let _this = this

      return ping(
        () => {
          _this.agentDown = false
        },
        error => {
          console.log('ping failed:', error)
          _this.agentDown = true
        }
      )
    },
    reping(event) {
      let _this = this

      let button = event.target
      _this.refreshMsg = 'Loading...'
      button.disabled = true

      let result = _this
        .ping()
        .then(() => {
          return this.updateServiceInfo()
        })
        .then(() => {
          return this.updateServiceState()
        })
        .catch(() => {
          _this.pingFailed.show()
        })
        .finally(() => {
          _this.refreshMsg = 'Refresh'
          button.disabled = false
          _this.hideRefreshMsg()
        })

      return result
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
