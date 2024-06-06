/* eslint-disable */
<!-- UserDetails.vue -->
<template>
  <NavigationMarker target="Marker"></NavigationMarker>
  <div class="device">
    <NavigationDevice target="Device2"></NavigationDevice>
    <NavigationDevice target="Device3"></NavigationDevice>
  </div>
</template>

<script>
import NavigationMarker from "@/components/NavigationMarker.vue" // eslint-disable-line
import NavigationDevice from "@/components/NavigationDevice.vue"

export default {
  name: "NavigationMonitorView",
  components: {
    NavigationMarker,
    NavigationDevice
  }
}
</script>

<style scoped>
  .device {
    display: flex
  }
</style>
