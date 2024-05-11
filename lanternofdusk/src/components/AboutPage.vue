<template>
  <div class="about">
    <h1>{{ msg }}</h1>
    <h2>프로젝트 소개</h2>
    <h3>Lantern Of Dusk는 스마트 헬멧 기반 소방 보조 시스템입니다.</h3>
    <p>
      소방 구조 활동 중 자신의 현재 위치를 파악할 수 없거나 <br>
      낮은 가시성으로 인해 구조 활동에 어려움이 있는 경우가 많습니다. <br>
      <br>
      따라서 GPS가 작동하기 힘든 실내의 환경에서도 사용자의 위치를 측정할 수 있는 <br>
      PDR 기법을 사용하여 소방관에게 자신의 위치를 제공하고 이 정보를 활용하여 <br>
      소방 지휘 체계에 사용할 수 있는 서비스를 기획하였습니다. <br>
      <br>
      파악된 소방관 개개인의 위치를 중앙 통제 센터에서 실시간으로 관제할 수 있고 <br>
      요구조자의 대략적인 위치를 소방관들이 쉽게 찾아갈 수 있도록 정보를 제공합니다.</p>

    <h3>프로젝트 위키 및 리소스 사이트</h3>
    <ul>
      <li><a href="https://freezing-smoke-057.notion.site/Lantern-Of-Dusk-bba4e4aa98524eae9a7426e0a4c02f43?pvs=4" target="_blank" rel="noopener">Notion</a></li>
      <li><a href="https://github.com/LanternOfDusk" target="_blank" rel="noopener">Github</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  props: {
    msg: String
  }
}
</script>

<style scoped>
h1 {
  margin: 0;
  padding: 40px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
