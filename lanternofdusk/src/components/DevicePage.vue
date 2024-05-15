<template>
  <div class="device">
    <h2>단말기 관리</h2>
    <ul>
      <li><router-link to="/device/add">단말기 추가</router-link></li>
      <li><router-link to="/device/list">단말기 목록</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DevicePage',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.device {
  padding-top: 120px;
}
h2 {
  margin: 0;
}
body { 
  padding: 0;
}
h1 {
  margin: 0;
  padding: 40px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  padding: 5px;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
