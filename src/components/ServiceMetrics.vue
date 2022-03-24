<template>
  <div v-if="!loaded" class="text-center mt-5">
    <div class="spinner-border d-inline-block me-3" role="status"></div>
    <h3 class="d-inline-block">Loading...</h3>
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
            <i class="bi bi-server fs-1 align-bottom"></i>
          </div>
          <div class="flex-grow-1 ms-2">
            <h5 class="fw-bold">
              <span class="align-bottom me-2">{{ service }}</span>
              <span class="badge bg-success fw-bolder">up</span>
            </h5>

            <div class="fw-bold d-inline">
              <span class="badge bg-info me-1 fw-bolder">mem_usage</span>
              <span class="align-middle">{{ metrics.raw.mem_usage }} </span>
            </div>

            <div class="fw-bold ms-2 d-inline">
              <span class="badge bg-warning me-1 fw-bolder">cpu_usage</span>
              <span class="align-middle">{{ metrics.cpuUsedPercent }}%</span>
            </div>

            <div class="fw-bold ms-2 d-inline">
              <span class="badge bg-primary me-1 fw-bolder">net_io</span>
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
            <div class="vw-auto h-300" id="memory-usage">
              <MetricChart></MetricChart>
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
            <div class="vw-auto h-300" id="cpu-usage"></div>
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
            <div class="vw-auto h-300" id="network-usage"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MetricChart from '@/components/MetricChart.vue'
import { ECharts as echarts } from 'vue-echarts' // eslint-disable-line no-unused-vars
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

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
      memoryUsageChart: null,
      cpuUsageChart: null,
      networkUsageChart: null,
    }
  },
  created() {
    // this.memoryUsageChart = echarts.init(document.getElementById('memory-usage'))
    // this.cpuUsageChart = echarts.init(document.getElementById('cpu-usage'))
    // this.networkUsageChart = echarts.init(document.getElementById('network-usage'))
  },
  methods: {
    rateChange(event) {
      console.log(event.target.value)
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
</style>
