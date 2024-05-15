<template>
  <div class="device">
    <DeviceList msg="Lantern Of Dusk"/>
  </div>
</template>

<script>
// @ is an alias to /src
import DeviceList from '@/components/DeviceList.vue'

export default {
  name: 'DeviceView',
  components: {
    DeviceList
  }
}
</script>