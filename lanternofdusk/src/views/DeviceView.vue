<template>
  <div class="device">
    <DevicePage msg="Lantern Of Dusk"/>
  </div>
</template>

<script>
// @ is an alias to /src
import DevicePage from '@/components/DevicePage.vue'

export default {
  name: 'DeviceView',
  components: {
    DevicePage
  }
}
</script>