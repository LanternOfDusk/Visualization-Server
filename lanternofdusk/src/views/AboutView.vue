<template>
  <div class="about">
    <img alt="Vue logo" src="../assets/logo.png">
    <AboutPage msg="Lantern Of Dusk"/>
  </div>
</template>

<script>
import AboutPage from '@/components/AboutPage.vue'

export default {
  name: 'AboutView',
  components: {
    AboutPage
  }
}
</script>

<style scoped>
img {
  margin-top: 40px;
}
</style>