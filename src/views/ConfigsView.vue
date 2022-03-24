<template>
  <ServiceConfig :service="service" :data="data"></ServiceConfig>
</template>
<script>
import ServiceConfig from '@/components/ServiceConfig.vue'
import { getConfig } from '@/api/system-agent'

export default {
  name: 'ConfigsView',
  components: { ServiceConfig },
  data() {
    return {
      service: '',
      data: null,
      getConfigFailed: null,
      hideMsg: null,
    }
  },
  beforeRouteEnter(to, from, next) {
    getConfig(
      to.query.services,
      res => {
        next(vm => {
          vm.service = res[0].config.serviceName
          vm.data = JSON.stringify(res[0].config, null, 3)
        })
      },
      () => {
        next(vm => {
          vm.getConfigFailed.show()
          vm.hideMsg()
        })
      }
    )
  },
  async beforeRouteUpdate(to) {
    this.service = ''
    this.data = null
    try {
      await getConfig(
        to.query.services,
        res => {
          this.service = res[0].config.serviceName
          this.data = JSON.stringify(res[0].config, null, 3)
        },
        err => {
          console.error(err)
          throw err
        }
      )
    } catch (error) {
      this.getConfigFailed.show()
      this.hideMsg()
    }
  },
  created() {
    this.getConfigFailed = this.createAlert('get config failed!', 'danger')
    this.hideMsg = this.debounce(() => {
      this.getConfigFailed.hide()
    }, 2000)
  },
}
</script>
