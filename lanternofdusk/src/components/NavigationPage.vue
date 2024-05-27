<template>
  <div class="navigation">
    <div class="section">
      <h2 class="section-title">Device List</h2>
      <div class="device-list">
        <ul>
          <li v-for="device in devices" :key="device.id" class="device-item" @click="selectDevice(device)">
            {{ device.name }} - {{ device.ae }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NavigationPage',
  data() {
    return {
      devices: []
    };
  },
  methods: {
    async fetchDevices() {
      try {
        const response = await axios.get('http://58.120.21.139:7777/api/connection/list');
        this.devices = response.data;
      } catch (error) {
        console.error('디바이스 목록을 가져오는 중 오류 발생:', error);
      }
    }
  },
  mounted() {
    this.fetchDevices(); 
  }
};
</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-around;
  padding: 80px;
  box-sizing: border-box;
}
.section {
  display: inline-block;
  width: 50%;
  height: 300px;
}
.section-title {
  width: 100%;
  text-align: center;
  margin: 20px 0;
}
.device-list {
  flex: 1;
  margin: 0 20px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}
.device-list ul {
  list-style-type: none;
  padding: 0;
}
.device-item {
  border-bottom: 1px solid #ddd;
  padding: 8px;
  margin: 5px 0;
  cursor: pointer;
}
.device-item:last-child {
  border-bottom: none;
}
.device-item:hover {
  color: blue;
  background-color: #e7e7e7;
}
</style>