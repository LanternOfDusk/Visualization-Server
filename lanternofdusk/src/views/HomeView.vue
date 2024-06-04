<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/logo.png">
    <h1>Lantern of Dusk</h1>
    <div class="button-group">
      <router-link to="/monitor" class="button">
        <div class="button-content">
          <div class="button-name">Monitor</div>
          <div class="button-description">메인 관제 페이지</div>
        </div>
      </router-link>
      <router-link to="/navigation" class="button">
        <div class="button-content">
          <div class="button-name">Navigation</div>
          <div class="button-description">단말기 네비게이션 페이지</div>
        </div>
      </router-link>
      <router-link to="/device" class="button">
        <div class="button-content">
          <div class="button-name">Device</div>
          <div class="button-description">단말기 관리 페이지</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  text-align: center;
  padding-top: 120px;
}
.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.button {
  display: inline-block;
  width: 200px;
  height: 200px;
  color: #000;
  background-color: transparent;
  text-decoration: none;
  border: 2px solid #8157CB;
  border-radius: 10px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
.button:hover {
  background-color: #f0f0f0;
  border-color: #6842a2;
}
.button-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.button-name {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
}
.button-description {
  font-size: 0.9em;
  color: #555;
}
img {
  width: 250px;
}
</style>