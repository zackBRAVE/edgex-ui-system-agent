<template>
  <div class="card">
    <div class="card-header">
      <span>
        <i class="bi bi-file-earmark-code-fill text-info me-1"></i>
        {{ service }}
        <span>Config Inspect</span>
      </span>
    </div>
    <div class="card-body">
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    service: {
      type: String,
      required: true,
    },
    data: {
      required: true,
    },
  },
  setup() {},
}
</script>
