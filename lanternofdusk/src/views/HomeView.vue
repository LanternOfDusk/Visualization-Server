<template>
  <div class="home">
    <HelloWorld msg="Lantern Of Dusk"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>

<style scoped>
img {
  margin-top: 110px;
}
</style>