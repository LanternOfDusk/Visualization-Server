<template>
  <div class="marker">
    <div class="section">
      <h2 class="section-title">Marker List</h2>
      <div class="marker-list">
        <ul>
          <li v-for="marker in markers" :key="marker.id" class="marker-item" @click="selectMarker(marker)">
            {{ marker.id }} : {{ marker.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="section">
      <h2 class="section-title">Edit Marker</h2>
      <div class="marker-form">
        <form @submit.prevent="updateMarker()">
          <div class="form-group">
            <label for="id">ID</label><br>
            <input type="text" id="id" v-model="newMarker.id" disabled>
          </div>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="newMarker.name">
          </div>
          <div class="form-group">
            Location<br>
            <div class="location-group">
              <label for="x">X : </label> 
              <input type="text" id="x" v-model="newMarker.x">
              <label for="x">Y : </label> 
              <input type="text" id="y" v-model="newMarker.y">
              <label for="x">Z : </label> 
              <input type="text" id="z" v-model="newMarker.z">
            </div>
          </div>
          <div class="button-group">
            <button type="button" class="cancel-btn" @click="resetForm">Cancel</button>
            <button type="button" class="delete-btn" @click="deleteMarker">Delete</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MarkerView',
  data() {
    return {
      markers: [],
      newMarker: { id: '', name: '', x: '', y: '', z: '' }
    };
  },
  methods: {
    async fetchMarker() { //서버에서 디바이스 목록 호출
      try {
        const response = await axios.get('http://58.120.21.139:7777/api/marker/list');
        this.markers = response.data;
      } catch (error) {
        console.error('디바이스 목록을 가져오는 중 오류 발생:', error);
      }
    },
    selectMarker(marker) {
      this.newMarker = { ...marker };
    },
    async deleteMarker() { //선택된 디바이스 서버에서 삭제
      try {
        await axios.delete(`http://58.120.21.139:7777/api/marker/${this.newMarker.id}`);
        this.fetchMarker();
        this.resetForm();
      } catch (error) {
        console.error('디바이스를 삭제하는 중 오류 발생:', error);
      }
    },
    resetForm() { //폼 리셋
      this.newMarker = { id: '', name: '', x: '', y: '', z: '' };
    }
  },
  mounted() {
    this.fetchMarker(); 
  }
};
</script>

<style scoped>
.marker {
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
.marker-title {
  width: 100%;
  text-align: center;
  margin: 20px 0;
}
.marker-list, .marker-form {
  flex: 1;
  margin: 0 20px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}
.marker-list ul {
  list-style-type: none;
  padding: 0;
}
.marker-item {
  border-bottom: 1px solid #ddd;
  padding: 8px;
  margin: 5px 0;
  cursor: pointer;
}
.marker-item:last-child {
  border-bottom: none;
}
.form-group {
  margin-bottom: 20px;
}
input[type="text"] {
  width: calc(100% - 20px);
  padding: 10px;
  margin-top: 4px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.button-group {
  display: inline-block;
  justify-content: space-between;
}
.location-group > input {
  width: 25%
}
.location-group > label {
  margin: 12px;
}
.submit-btn, .delete-btn, .cancel-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  width: 110px;
  margin: 5px;
}
.submit-btn:last-child, .delete-btn:last-child, .cancel-btn:last-child {
  margin-right: 0;
}
.submit-btn:hover {
  background-color: #45a049;
}
.delete-btn {
  background-color: #f44336;
}
.delete-btn:hover {
  background-color: #e53935;
}
.cancel-btn {
  background-color: #ffc107;
}
.cancel-btn:hover {
  background-color: #ffb300;
}
.marker-item:hover {
  color: blue;
  background-color: #e7e7e7;
}
</style>