<template>
  <div class="about">
    <h1>Lantern Of Dusk</h1>
    <hr>
    <h3>프로젝트 소개</h3>
    <hr width="110px">
    <p>
      Lantern Of Dusk는 스마트 헬멧 기반 소방 보조 시스템입니다. <br><br>
      소방 구조 활동 중 자신의 현재 위치를 파악할 수 없거나 <br>
      낮은 가시성으로 인해 구조 활동에 어려움이 있는 경우가 많습니다. <br>
      <br>
      따라서 GPS가 작동하기 힘든 실내의 환경에서도 사용자의 위치를 측정할 수 있는 <br>
      PDR 기법을 사용하여 소방관에게 자신의 위치를 제공하고 이 정보를 활용하여 <br>
      소방 지휘 체계에 사용할 수 있는 서비스를 기획하였습니다. <br>
      <br>
      파악된 소방관 개개인의 위치를 중앙 통제 센터에서 실시간으로 관제할 수 있고 <br>
      요구조자의 대략적인 위치를 소방관들이 쉽게 찾아갈 수 있도록 정보를 제공합니다.
    </p>
    <h3>주요 기능</h3>
    <hr width="80px">
    <p>
      - 중앙 통제 센터에서의 소방관 개개인의 실시간 위치 파악 및 관제 기능 -<br><br>
      - 소방관 개인 단말기를 이용한 요구조자나 중앙 통제 센터에서 지정한 위치로의 안내 기능 -<br><br>
      - 소방관 개인 단말기를 이용한 주변 소방관 현황과 위치 파악 기능 -
    </p>
    <h3>팀 멤버</h3>
    <hr width="70px">
    <p>
      김경탁<br><br>
      석준현<br><br>
      염준선<br><br>
      임우진<br><br>
      진혜민
    </p>
    <h3>프로젝트 위키 및 리소스 사이트</h3>
    <hr width="240px">
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

.about {
  padding: 50px;
}
</style>
