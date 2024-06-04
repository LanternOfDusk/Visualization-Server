<!-- UserDetails.vue -->
<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import axios from 'axios';

const route = useRoute();
const ae = route.params.ae;

const threeContainer = ref(null);

const scene = new THREE.Scene(); // 장면 생성
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 카메라 생성
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 랜더러 생성
let frameId, interval;
let obj;

const initThree = () => {
  // 장면 세부설정
  scene.background = new THREE.Color(0xffffff);
  
  // 카메라 세부설정
  camera.position.set(0, 2, 5);

  // 조명 설정 및 생성
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(-1, 2, 4);
  scene.add(dirLight);

  // 랜더러 세부설정
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  if (threeContainer.value) {
    threeContainer.value.appendChild(renderer.domElement);
  }

  // 바닥 그리드 로드
  const grid = new THREE.GridHelper(1600, 320);
  scene.add( grid );

  const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
  const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
  const cube = new THREE.Mesh(geometry, fillMaterial);

  const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
  const line = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry), lineMaterial);
  
  const group = new THREE.Group()
  group.add(cube);
  group.add(line);
  scene.add(group);

  obj = group;

  // 이벤트 등록
  window.addEventListener('resize', onWindowResize);
};

const onWindowResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

const render = () => {
  renderer.render(scene, camera);
  frameId = requestAnimationFrame(render);
};

// const connectWebSocket = () => {
//   const ws = new WebSocket('ws://192.168.1.74:7777/ws?type=client');
  
//   ws.onopen = () => {
//     console.log('WebSocket connected!');
//   };
  
//   ws.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     //const { ax, ay, az, qw, qx, qy, qz } = data;
//     const { ax, ay, az } = data;
//     //const { qw, qx, qy, qz } = data;

    
//     console.log(obj.cube.quaternion)
    
//     obj.cube.position.x = ax
//     obj.cube.position.y = ay
//     obj.cube.position.z = az

//     //camera.position.set(obj.cube.position.x, obj.cube.position.y + 1, obj.cube.position.z)

//     //console.log(obj.cube.rotation)
//   };
  
//   ws.onclose = () => {
//     console.log('WebSocket disconnected.');
//   };
  
//   ws.onerror = (error) => {
//     console.error('WebSocket error:', error);
//   };
// };

const getDataByAPI = () => {
  interval = setInterval(() => {
    axios
      .get("http://203.253.128.177:7579/Mobius/" + ae + "/DATA/la", {
        headers: {
          "Accept": "application/json",
          "X-M2M-RI": "12345",
          "X-M2M-Origin": "SOrigin"
        }
      })
      .then((response) => {
        console.log(obj.cube.rotation)

        const gx = response.data['m2m:cin'].con.rx * (Math.PI / 180)
        const gy = response.data['m2m:cin'].con.ry * (Math.PI / 180)
        const gz = response.data['m2m:cin'].con.rz * (Math.PI / 180)

        obj.rotation.set(gx, gy, gz);
      })
  }, 20);
}

onMounted(() => {  
  initThree();
  render(); 
  getDataByAPI()
});

onUnmounted(() => {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
  }
  window.removeEventListener('resize', onWindowResize);
  clearInterval(interval)
});

</script>
