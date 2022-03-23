<template>
  <tr>
    <td>{{ data.name }}</td>
    <td>
      <span v-if="alive" class="badge bg-success">running</span>
      <span v-else class="badge bg-danger">stopped</span>
    </td>
    <td>
      <a v-if="alive">
        <router-link to="/metrics">
          <i class="bi bi-clipboard-pulse text-primary" role="img" aria-label="metrics"></i>
        </router-link>
      </a>
      <a v-else><i class="bi bi-slash-circle text-danger" role="img" aria-label="stopped"></i></a>
    </td>
    <td>
      <a v-if="alive">
        <router-link to="/configs">
          <i class="bi bi-file-earmark-code text-primary" role="img" aria-label="config"></i>
        </router-link>
      </a>
      <a v-else><i class="bi bi-slash-circle text-danger" role="img" aria-label="stopped"></i></a>
    </td>
    <td>
      <span class="badge bg-info me-1" role="button" v-on:click="start(data.name)">start</span>
      <span class="badge bg-warning me-1" role="button" v-on:click="restart(data.name)">restart</span>
      <span class="badge bg-danger" role="button" v-on:click="stop(data.name)">stop</span>
    </td>
  </tr>
</template>

<script>
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
    }
  },
  created() {
    this.alive = this.isAlive(this.data.statusCode)
  },
  updated() {
    this.alive = this.isAlive(this.data.statusCode)
  },
  methods: {
    isAlive(statusCode) {
      return statusCode.toString().startsWith('2')
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
