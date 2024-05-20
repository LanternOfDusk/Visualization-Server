<template>
  <div class="device">
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
    <div class="section">
      <h2 class="section-title">{{ isEditMode ? 'Edit Device' : 'Create Device' }}</h2>
      <div class="device-form">
        <form @submit.prevent="isEditMode ? updateDevice() : createDevice()">
          <div class="form-group" v-if="isEditMode">
            <label for="id">ID</label><br>
            <input type="text" id="id" v-model="newDevice.id" disabled>
          </div>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="newDevice.name">
          </div>
          <div class="form-group">
            <label for="ae">AE</label>
            <input type="text" id="ae" v-model="newDevice.ae">
          </div>
          <div class="button-group">
            <button v-if="isEditMode" type="button" class="delete-btn" @click="deleteDevice">Delete</button>
            <button v-if="!isEditMode" type="button" class="cancel-btn" @click="resetForm">Cancel</button>
            <button type="submit" class="submit-btn">{{ isEditMode ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DevicePage',
  data() {
    return {
      devices: [
        { id: '1', name: 'test1', ae: 'device1' },
        { id: '2', name: 'test2', ae: 'device2' },
        { id: '3', name: 'test3', ae: 'device3' }
      ],
      newDevice: { id: '', name: '', ae: '' },
      isEditMode: false
    }
  },
  methods: {
    selectDevice(device) {
      this.newDevice = { ...device };
      this.isEditMode = true;
    },
    updateDevice() {
      let index = this.devices.findIndex(d => d.id === this.newDevice.id);
      if (index !== -1) {
        this.devices[index] = { ...this.newDevice };
      }
      this.resetForm();
    },
    createDevice() {
      this.newDevice.id = (this.devices.length + 1).toString();
      this.devices.push({ ...this.newDevice });
      this.resetForm();
    },
    deleteDevice() {
      this.devices = this.devices.filter(d => d.id !== this.newDevice.id);
      this.resetForm();
    },
    resetForm() {
      this.newDevice = { id: '', name: '', ae: '' };
      this.isEditMode = false;
    }
  }
}
</script>

<style scoped>
.device {
  display: flex;
  justify-content: space-around;
  padding: 80px;
  box-sizing: border-box;
}
.section {
  display: inline-block;
  width : 50%;
  height: 300px;
}
.section-title {
  width: 100%;
  text-align: center;
  margin: 20px 0;
}
.device-list, .device-form {
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
.device-item:hover {
  color: blue; /* 변경하고자 하는 글자 색상으로 설정 */
}
</style>