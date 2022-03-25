<template>
  <ServiceMetrics :service="service" :metrics="metrics" :loaded="loaded" @update-metrics="updateMetrics"></ServiceMetrics>
</template>

<script>
import ServiceMetrics from '@/components/ServiceMetrics.vue'
import { getMetrics } from '@/api/system-agent'

export default {
  name: 'MetricsView',
  components: { ServiceMetrics },
  data() {
    return {
      service: '',
      metrics: null,
      loaded: false,
      getMetricsFailed: null,
      hideMsg: null,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.service = to.query.services
      getMetrics(
        vm.service,
        res => {
          vm.metrics = res[0].metrics
          vm.loaded = true
        },
        () => {
          vm.getMetricsFailed.show()
          vm.hideMsg()
          vm.loaded = false
        }
      )
    })
  },
  async beforeRouteUpdate(to) {
    let _this = this
    this.service = ''
    this.data = null
    try {
      await getMetrics(
        to.query.services,
        res => {
          _this.service = res[0].serviceName
          _this.metrics = res[0].metrics
          _this.loaded = true
        },
        err => {
          console.error(err)
          throw err
        }
      )
    } catch (error) {
      _this.getMetricsFailed.show()
      _this.hideMsg()
      _this.loaded = false
    }
  },
  created() {
    this.getMetricsFailed = this.createAlert('get metrics failed!', 'danger')
    this.hideMsg = this.debounce(() => {
      this.getMetricsFailed.hide()
    }, 2000)
  },
  methods: {
    updateMetrics() {
      let _this = this
      getMetrics(
        _this.service,
        res => {
          _this.metrics = res[0].metrics
        },
        err => {
          console.error(err)
          throw err
        }
      )
    }
  }
}
</script>
