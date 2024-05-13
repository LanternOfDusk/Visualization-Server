<template>
  <div class="device-list">
    <ul>
      <li><router-link to="/device/add">단말기 추가</router-link></li>
      <li><router-link to="/device/list">단말기 목록</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DeviceList'
}
</script>

<style scoped>
.device-list {
  width: 300px;
  height: 80vh;
  background-color: #2c3e50;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 5px;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
