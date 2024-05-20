<template>
  <nav>
    <router-link to="/">Home</router-link> &nbsp;&nbsp;|&nbsp;&nbsp;
    <router-link to="/monitor">Monitor</router-link> &nbsp;&nbsp;|&nbsp;&nbsp;
    <router-link to="/navigation">Navigation</router-link> &nbsp;&nbsp;|&nbsp;&nbsp;
    <router-link to="/device">Device</router-link> &nbsp;&nbsp;|&nbsp;&nbsp;
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  position: fixed;
  height: 60px;
  line-height: 60px;
  width: 100vw;
  background-color: #ffffff;
  box-shadow: 0px 1px 20px -10px #2c3e50;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #8157CB;
}
</style>
