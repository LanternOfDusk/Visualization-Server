<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

export default {
  setup() {
    const threeContainer = ref(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const keyStates = {};
    //const dots = {};

    let frameId;

    const initThree = () => {
      // scene 설정
      scene.background = new THREE.Color(0xffffff);
      
      // camera 설정
      camera.position.set(0, 20, 80);
      camera.rotation.order = 'YXZ';

      // 렌더러 설정
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      if (threeContainer.value) {
        threeContainer.value.appendChild(renderer.domElement);
      }

      // 바닥 설정
      const grid = new THREE.GridHelper(100, 20);
      scene.add( grid );

      // 이벤트 핸들러 설정
      window.addEventListener('resize', onWindowResize);
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('click', onClick);
    };

    const onWindowResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    const onKeyDown = (event) => {
      keyStates[event.code] = true;
    };

    const onKeyUp = (event) => {
      keyStates[event.code] = false;
    };

    const onMouseMove = (event) => {
      if (document.pointerLockElement === document.body) {
        camera.rotation.y -= event.movementX / 700;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x - event.movementY / 700));
      }
    };

    const onClick = () => {
      if (document.pointerLockElement === null) {
        document.body.requestPointerLock();
      }
      else {
        document.exitPointerLock();
      }
    };

    const render = () => {
      frameId = requestAnimationFrame(render);
      renderer.render(scene, camera);
      updateCamera();
    };

    const updateCamera = () => {
      let speed = keyStates['ControlLeft'] ? 1 : 0.5;

      if (keyStates['KeyW']) {
        camera.position.add(getForwardVector().multiplyScalar(speed));
      }
      if (keyStates['KeyS']) {
        camera.position.add(getForwardVector().multiplyScalar(-speed));
      }
      if (keyStates['KeyA']) {
        camera.position.add(getSideVector().multiplyScalar(-speed));
      }
      if (keyStates['KeyD']) {
        camera.position.add(getSideVector().multiplyScalar(speed));
      }
      if (keyStates['Space']) {
        camera.position.y += 0.5;
      }
      if (keyStates['ShiftLeft']) {
        camera.position.y -= 0.5;
      }
    }

    function getForwardVector() {
      let cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      cameraDirection.y = 0;
      cameraDirection.normalize();
      return cameraDirection;
    }

    function getSideVector() {
      let cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      cameraDirection.y = 0;
      cameraDirection.normalize();
      cameraDirection.cross(camera.up);
      return cameraDirection;
    }

    // const setDots = () => {

    // }

    // let index = 0;
    // let up = true;
    // const fetchData = () => {
    //   try {
    //     // 외부 API에서 데이터를 가져옴
    //     // const response = await fetch('외부 API URL');
    //     // const data = await response.json();

    //     // 테스트 값
    //     const data = {
    //       "x" : 0,
    //       "y" : 1,
    //       "z" : 0
    //     }

    //     // 받아온 데이터를 이용하여 3D 화면에 점 추가
    //     const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    //     const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true });
    //     const point = new THREE.Mesh(geometry, material);
    //     point.position.set(data.x + index, data.y, data.z); // 외부 API에서 받아온 좌표 데이터를 사용하여 점의 위치 설정
    //     point.material.opacity = 0;
    //     scene.add(point);

    //     let up = true;
    //     setInterval(() => {
    //       if (point.material.opacity == 1) {
    //         up = false;
    //       }
    //       let i = up ? 0.02 : -0.02;
    //       point.material.opacity +=i;
    //     }, 10);
        
        
    //     // setTimeout(() => {
    //     //   point.material.opacity = 1;
    //     //   setTimeout(() => {
    //     //     scene.remove(point);
    //     //   }, 500);
    //     // }, 500);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    //   console.log(index);
    //   if (index == 10) up = false;
    //   if (index == 0) up = true;

    //   index = up ? index + 1 : index - 1;
    // };

    onMounted(() => {
      initThree(); // 컴포넌트가 마운트되면 초기화
      render(); // 랜더링 시작
      //setInterval(fetchData, 1000);
    });

    onUnmounted(() => {
      // 컴포넌트가 언마운트되면 정리 작업
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick);
    });

    return {
      threeContainer,
    };
  },
};
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
