<template>
  <div class="system-agent">
    <ServiceList></ServiceList>
  </div>
</template>

<script>
import ServiceList from '@/components/ServiceList.vue'

export default {
  name: 'ServiceListView',
  components: { ServiceList },
}
</script>

<style>
.system-agent {
  margin: 1vh;
}
</style>
