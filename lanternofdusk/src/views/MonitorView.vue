<template>
  <div ref="threeContainer" class="three-container">
    <MainMonitor msg="Lantern Of Dusk"/>
  </div>
</template>

<script>
import MainMonitor from '@/components/MainMonitor.vue'

export default {
  name: 'MonitorView',
  components: {
    MainMonitor
  }
}
</script>