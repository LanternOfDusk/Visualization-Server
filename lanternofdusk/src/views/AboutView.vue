<template>
  <div class="about">
    <img alt="Vue logo" src="../assets/logo.png">
    <AboutComponents msg="Lantern Of Dusk"/>
  </div>
</template>

<script>
import AboutComponents from '@/components/AboutComponents.vue'

export default {
  name: 'AboutView',
  components: {
    AboutComponents
  }
}
</script>

<style scoped>
img {
  margin-top: 40px;
}
</style>