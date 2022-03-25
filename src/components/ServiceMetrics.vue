<template>
  <div v-if="!loaded" class="vh-80 d-flex justify-content-center align-items-center">
    <div class="spinner-border me-3" role="status"></div>
    <h3 class="d-inline-block pt-2">Loading...</h3>
  </div>
  <div v-else>
    <div class="card mb-3">
      <div class="card-header fw-bold">
        <i class="bi bi-gear-fill me-1"></i>
        <span class="align-top">Setting</span>
      </div>
      <div class="card-body">
        <div class="d-flex">
          <div class="flex-shrink-0 me-2">
            <i class="bi bi-server fs-1 align-bottom text-info"></i>
          </div>
          <div class="flex-grow-1 ms-2">
            <h5 class="fw-bold">
              <span class="align-bottom me-2">{{ service }}</span>
              <span class="badge bg-success fw-bolder">up</span>
            </h5>

            <div class="fw-bold d-inline">
              <span class="badge bg-primary me-1 fw-bolder">mem_usage</span>
              <span class="align-middle">{{ metrics.raw.mem_usage }} </span>
            </div>

            <div class="fw-bold ms-2 d-inline">
              <span class="badge bg-warning me-1 fw-bolder">cpu_usage</span>
              <span class="align-middle">{{ metrics.cpuUsedPercent }}%</span>
            </div>

            <div class="fw-bold ms-2 d-inline">
              <span class="badge bg-info me-1 fw-bolder">net_io</span>
              <span class="align-middle">{{ metrics.raw.net_io }}</span>
            </div>
          </div>
        </div>
        <div class="input-group mb-3 mt-3 w-200">
          <label class="input-group-text" for="inputGroupSelect01">Refresh Rate</label>
          <select
            class="form-select"
            id="inputGroupSelect01"
            v-model="refreshRate"
            @change="rateChange"
          >
            <option value="1">1s</option>
            <option selected value="3">3s</option>
            <option value="5">5s</option>
            <option value="10">10s</option>
            <option value="15">15s</option>
          </select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4">
        <div class="card mb-3">
          <div class="card-header">
            <i class="bi bi-memory me-1"></i>
            <span>Memory usage</span>
          </div>
          <div class="card-body overflow-auto">
            <div class="width-100 h-300">
              <MetricChart
                ref="memChart"
                :metric-type="memUsage"
                :metric-value="memMetrics"
                :time-array="timeArray"
                :start-time="startTime"
              ></MetricChart>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card mb-3">
          <div class="card-header">
            <i class="bi bi-cpu me-1"></i>
            <span>CPU usage</span>
          </div>
          <div class="card-body overflow-auto">
            <div class="vw-auto h-300 ps-1">
              <MetricChart
                ref="cpuChart"
                :metric-type="cpuUsage"
                :metric-value="cpuMetrics"
                :time-array="timeArray"
                :start-time="startTime"
              ></MetricChart>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <i class="bi bi-hdd-network me-1"></i>
            <span>Network traffic</span>
          </div>
          <div class="card-body overflow-auto">
            <div class="vw-auto h-300">
              <MetricChart
                ref="netChart"
                :metric-type="netTraffic"
                :metric-value="netMetricsRX"
                :metric-value2="netMetricsTX"
                :time-array="timeArray"
                :start-time="startTime"
              ></MetricChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import MetricChart from '@/components/MetricChart.vue'

export default {
  components: {
    MetricChart,
  },
  props: {
    service: {
      type: String,
      required: true,
    },
    metrics: {
      required: true,
    },
    loaded: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      refreshRate: 3,
      refreshTimer: null,
      memUsage: 'Memory Usage',
      cpuUsage: 'CPU Usage',
      netTraffic: 'Network Traffic',
      memMetrics: Array(20).fill(0),
      cpuMetrics: Array(20).fill(0),
      netMetricsRX: Array(20).fill(0),
      netMetricsTX: Array(20).fill(0),
      timeArray: Array(20).fill('00:00:00'),
      startTime: '00:00:19',
      netConfigured: false,
    }
  },
  setup() {
    const netChart = ref(null)
    function configureNetChart() {
      netChart.value.option.series[0].name = 'RX (Receive Bytes/sec)'
      netChart.value.option.series[0].stack = '总量'
      netChart.value.option.series[1].name = 'TX (Transmit Bytes/sec)'
      netChart.value.option.series[1].stack = '总量'
      netChart.value.option.legend = {
        data: ['RX (Receive Bytes/sec)', 'TX (Transmit Bytes/sec)'],
      }
      netChart.value.option.tooltip = {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#316ccc',
          },
        },
      }
      netChart.value.option.yAxis = [
        {
          type: 'value',
          axisLabel: {
            margin: 2,
          },
        },
      ]
    }

    return { netChart, configureNetChart }
  },
  created() {
    let timeArray = []
    let secArr = [...Array(20).keys()]
    secArr.forEach(second => {
      timeArray.push(`00:00:${second < 10 ? '0' + second : second}`)
    })
    this.timeArray = timeArray
    this.startTime = timeArray[19]

    this.refreshTimer = setInterval(() => {
      this.$emit('updateMetrics')
    }, this.refreshRate * 1000)
  },
  beforeUpdate() {
    if (this.loaded) {
      this.updateMetrics()
    }
  },
  updated() {
    if (!this.netConfigured && this.loaded) {
      this.netConfigured = true
      this.configureNetChart()
    }
  },
  methods: {
    rateChange() {
      clearInterval(this.refreshTimer)
      this.refreshTimer = setInterval(() => {
        this.$emit('updateMetrics')
      }, this.refreshRate * 1000)
    },
    updateMetrics() {
      this.timeArray.shift()
      this.timeArray.push(this.getTimeString())

      this.memMetrics.shift()
      this.memMetrics.push(
        +this.metrics.raw.mem_perc.substring(0, this.metrics.raw.mem_perc.length - 1)
      )

      this.cpuMetrics.shift()
      this.cpuMetrics.push(+this.metrics.cpuUsedPercent)

      this.netMetricsRX.shift()
      this.netMetricsTX.shift()
      let rx_tx_array = this.metrics.raw.net_io.split('/')
      let rx = rx_tx_array[0].trim().replace('kB', '').replace('MB', '')
      let tx = rx_tx_array[1].trim().replace('kB', '').replace('MB', '')
      this.netMetricsRX.push(+rx)
      this.netMetricsTX.push(+tx)
    },
    getTimeString() {
      let now = new Date()
      let hours = now.getHours()
      let minutes = now.getMinutes()
      let seconds = now.getSeconds()

      return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${
        seconds < 10 ? '0' + seconds : seconds
      }`
    },
  },
}
</script>

<style scoped>
.w-200 {
  width: 200px;
}

.h-300 {
  height: 300px;
}

.vh-80 {
  height: 80vh;
}
</style>
