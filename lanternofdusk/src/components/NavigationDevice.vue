/* eslint-disable */
<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<script setup>
//import { useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
//import axios from 'axios';

//const route = useRoute();
//const ae = route.params.ae;
                        
const threeContainer = ref(null);

const scene = new THREE.Scene(); // 장면 생성
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight), 0.1, 1000); // 카메라 생성
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 랜더러 생성
let frameId, interval;
let obj;
let targetPosition = {
  x : 0, y : 0, z : 0
};
let position = {
  x : 0, y : 0, z : 0
};
const target = defineProps( { // eslint-disable-line
  target: String // eslint-disable-line
})// eslint-disable-line

const initThree = () => {
  
  // 카메라 세부설정
  camera.position.set(0, 5, -5);
  camera.lookAt(0,3,0)

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  hemiLight.position.set(0, 100, 0);
  scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(0, 50, 50);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.bias = -0.001;
  scene.add(dirLight);
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  const pointLight1 = new THREE.PointLight(0xffaa00, 1, 100);
  pointLight1.position.set(50, 50, 50);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0x00aaff, 0.8, 100);
  pointLight2.position.set(-50, -50, 50);
  scene.add(pointLight2);

  // 랜더러 세부설정
  renderer.setSize(window.innerWidth/2, window.innerHeight / 2);
  renderer.setPixelRatio(window.devicePixelRatio);
  if (threeContainer.value) {
    threeContainer.value.appendChild(renderer.domElement);
  }

  const grid = new THREE.GridHelper(100, 100);
  scene.add( grid );

  const arrowGeo = new THREE.ConeGeometry( 0.5, 3, 12 );
  const arrowMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const arrow = new THREE.Mesh(arrowGeo, arrowMat);
  arrow.position.y = 3
  scene.add(arrow)

  obj = arrow;
  // 이벤트 등록
  window.addEventListener('resize', onWindowResize);
};

const onWindowResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth/2, window.innerHeight/2);
  }
};

const render = () => {
  renderer.render(scene, camera);
  frameId = requestAnimationFrame(render);
  console.log(targetPosition, position)
  obj.lookAt(targetPosition.x - position.x, targetPosition.y - position.y, targetPosition.z - position.z)
};

// const getDataByAPI = () => {
//   interval = setInterval(() => {
//     axios
//       .get("http://203.253.128.177:7579/Mobius/" + ae + "/DATA/la", {
//         headers: {
//           "Accept": "application/json",
//           "X-M2M-RI": "12345",
//           "X-M2M-Origin": "SOrigin"
//         }
//       })
//       .then((response) => {
//         position = {
//           x: response.data["m2m:cin"].con.px,
//           y: response.data["m2m:cin"].con.py,
//           z: response.data["m2m:cin"].con.pz,
//           yaw: response.data["m2m:cin"].con.rz
//         }
//       })
//   }, 500);
// }

const getDataByAPI = () => {
  const ws = new WebSocket('ws://58.120.21.139:7777/ws?type=client');
  
  ws.onopen = () => {
    console.log('WebSocket connected!');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const { ae, px, py, pz, rz } = data;

    if (ae == "Device1") {
      position = {
        x: px,
        y: py,
        z: pz,
        yaw: rz
      }
    }
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected.');
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

// const setMarker = () => {
//   interval = setInterval(() => {
//     axios
//       .get("http://203.253.128.177:7579/Mobius/" + target.target + "/DATA/la", {
//         headers: {
//           "Accept": "application/json",
//           "X-M2M-RI": "12345",
//           "X-M2M-Origin": "SOrigin"
//         }
//       })
//       .then((response) => {
//         targetPosition = {
//           x: response.data["m2m:cin"].con.px,
//           y: response.data["m2m:cin"].con.py,
//           z: response.data["m2m:cin"].con.pz,
//           yaw: response.data["m2m:cin"].con.rz
//         }
//       })
//   }, 500);
// }

const setMarker = () => {
  const ws = new WebSocket('ws://58.120.21.139:7777/ws?type=client');
  
  ws.onopen = () => {
    console.log('WebSocket connected!');
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const { ae, px, py, pz, rz } = data;

    if (ae == target.target) {
      position = {
        x: px,
        y: py,
        z: pz,
        yaw: rz
      }
    }
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected.');
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

onMounted(() => {  
  initThree();
  getDataByAPI();
  setMarker();
  render(); 
});

onUnmounted(() => {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
  }
  window.removeEventListener('resize', onWindowResize);
  clearInterval(interval)
});
</script>
