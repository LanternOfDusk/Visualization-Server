<template>
  <div class="about">
    <h1>Lantern Of Dusk</h1>
    <hr class="main-divider">
    <div class="content">
      <section class="card intro">
        <h3>프로젝트 소개</h3>
        <hr class="sub-divider">
        <p>
          Lantern Of Dusk는 스마트 헬멧 기반 소방 보조 시스템입니다.
          소방 구조 활동 중 자신의 현재 위치를 파악할 수 없거나 낮은 가시성으로 인해 구조 활동에 어려움이 있는 경우가 많습니다. 
          따라서 GPS가 작동하기 힘든 실내의 환경에서도 사용자의 위치를 측정할 수 있는 PDR 기법을 사용하여 
          소방관에게 자신의 위치를 제공하고 이 정보를 활용하여 소방 지휘 체계에 사용할 수 있는 서비스를 기획하였습니다. 
          파악된 소방관 개개인의 위치를 중앙 통제 센터에서 실시간으로 관제할 수 있고 요구조자의 대략적인 위치를 소방관들이 쉽게 찾아갈 수 있도록 정보를 제공합니다.
        </p>
      </section>
      <section class="card features">
        <h3>주요 기능</h3>
        <hr class="sub-divider">
        <p>
          - 중앙 통제 센터에서의 소방관 개개인의 실시간 위치 파악 및 관제 기능 -<br><br>
          - 소방관 개인 단말기를 이용한 요구조자나 중앙 통제 센터에서 지정한 위치로의 안내 기능 -<br><br>
          - 소방관 개인 단말기를 이용한 주변 소방관 현황과 위치 파악 기능 -
        </p>
      </section>
      <section class="card team">
        <h3>팀 멤버</h3>
        <hr class="sub-divider">
        <p>
          김경탁<br><br>
          석준현<br><br>
          염준선<br><br>
          임우진<br><br>
          진혜민
        </p>
      </section>
      <section class="card resources">
        <h3>프로젝트 위키 및 리소스 사이트</h3>
        <hr class="sub-divider">
        <ul>
          <li><a href="https://freezing-smoke-057.notion.site/Lantern-Of-Dusk-bba4e4aa98524eae9a7426e0a4c02f43?pvs=4" target="_blank" rel="noopener">Notion</a></li>
          <li><a href="https://github.com/LanternOfDusk" target="_blank" rel="noopener">Github</a></li>
        </ul>
      </section>
    </div>
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
.about {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  font-family: Arial, sans-serif;
  color: #333;
}
h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-align: center;
  color: #8157CB;
}
h3 {
  font-size: 1.5em;
  margin-bottom: 10px;
  text-align: center;
}
hr.main-divider {
  width: 60%;
  margin: 20px auto;
  border: none;
  border-top: 2px solid #8157CB;
}
hr.sub-divider {
  width: 50px;
  margin: 10px auto;
  border: none;
  border-top: 2px solid #8157CB;
}
.content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 1 1 calc(45% - 20px);
  box-sizing: border-box;
  margin-bottom: 20px;
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px 0;
}
a {
  color: #8157CB;
  text-decoration: none;
  font-weight: bold;
}
a:hover {
  text-decoration: underline;
}
p {
  font-size: 1.1em;
  line-height: 1.6;
}
</style>