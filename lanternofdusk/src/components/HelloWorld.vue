<template>
  <div class="hello">
    <img alt="Vue logo" src="@/assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>사이트맵</h2>
    <ul>
      <li><router-link to="/">Home - 메인 페이지</router-link></li>
      <li><router-link to="/monitor">Monitor - 메인 관제 페이지</router-link></li>
      <li><router-link to="/navigation">Navigation - 단말기 네비게이션 페이지</router-link></li>
      <li><router-link to="/device">Device - 단말기 관리 페이지</router-link></li>
      <li><router-link to="/about">About - 소개 페이지</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.hello {
  padding-top: 120px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 5px;
}
a {
  color: #42b983;
}
</style>
