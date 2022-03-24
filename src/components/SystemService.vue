<template>
  <tr>
    <td>{{ data.name }}</td>
    <td>
      <span v-if="alive" class="badge bg-success">running</span>
      <span v-else class="badge bg-danger">stopped</span>
    </td>
    <td>
      <a v-if="alive">
        <router-link :to="{ path: '/metrics', query: { services: data.name } }">
          <i class="bi bi-clipboard-pulse text-primary" role="img" aria-label="metrics"></i>
        </router-link>
      </a>
      <a v-else><i class="bi bi-slash-circle text-danger" role="img" aria-label="stopped"></i></a>
    </td>
    <td>
      <a v-if="alive">
        <router-link :to="{ path: '/configs', query: { services: data.name } }">
          <i class="bi bi-file-earmark-code text-primary" role="img" aria-label="config"></i>
        </router-link>
      </a>
      <a v-else><i class="bi bi-slash-circle text-danger" role="img" aria-label="stopped"></i></a>
    </td>
    <td>
      <span
        ref="start"
        class="badge bg-info me-1"
        role="button"
        @click="operation(data.name, 'start')"
        >start</span
      >
      <span
        ref="restart"
        class="badge bg-warning me-1"
        role="button"
        @click="operation(data.name, 'restart')"
        >restart</span
      >
      <span ref="stop" class="badge bg-danger" role="button" @click="operation(data.name, 'stop')"
        >stop</span
      >
    </td>
  </tr>
</template>

<script>
import { operation } from '@/api/system-agent'

export default {
  name: 'SystemService',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup() {},
  data() {
    return {
      alive: false,
      operationDone: null,
      operationFailed: null,
      hideOperationMsg: null,
      recoverOperations: null,
      operationDisabled: false,
    }
  },
  created() {
    this.alive = this.isAlive(this.data.statusCode)
    this.operationDone = this.createAlert('operation succeeded!', 'success')
    this.operationFailed = this.createAlert('operation failed!', 'danger')
    this.hideOperationMsg = this.debounce(() => {
      this.operationDone.hide()
      this.operationFailed.hide()
    }, 1500)
    this.recoverOperations = this.debounce(() => {
      this.operationDisabled = false
      this.$refs.start.classList.remove('disabled')
      this.$refs.restart.classList.remove('disabled')
      this.$refs.stop.classList.remove('disabled')
    }, 1500)
  },
  updated() {
    this.alive = this.isAlive(this.data.statusCode)
  },
  methods: {
    isAlive(statusCode) {
      return statusCode.toString().startsWith('2')
    },
    operation(name, op) {
      if (this.operationDisabled) {
        return
      }

      let _this = this
      _this.disableOperations()
      operation(
        name,
        op,
        res => {
          _this.operationDone.changeMessage(`${res.serviceName} ${op} succeeded!`)
          _this.operationDone.show()
        },
        err => {
          _this.operationFailed.changeMessage(`${err?.serviceName} ${op} failed!\n${err?.message}`)
          _this.operationFailed.show()
        },
        () => {
          _this.recoverOperations()
          _this.hideOperationMsg()
          _this.$emit('refreshStatus')
        }
      )
    },
    disableOperations() {
      this.operationDisabled = true
      if (!this.$refs.start.classList.contains('disabled')) {
        this.$refs.start.classList.add('disabled')
        this.$refs.restart.classList.add('disabled')
        this.$refs.stop.classList.add('disabled')
      }
    },
  },
}
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.7;
}
</style>
