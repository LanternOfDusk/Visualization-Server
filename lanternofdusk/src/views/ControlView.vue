<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

export default {
  setup() {
    const threeContainer = ref(null);

    let scene, camera, renderer, animationFrameId;
    const keyStates = {};

    const initThree = () => {
      // 장면 초기화
      scene = new THREE.Scene();

      // 카메라 설정
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 1.6, 5); // 카메라 위치 설정
      camera.rotation.order = 'YXZ';

      // 조명 설정
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 주변광
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 방향광
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);

      // 바닥 설정
      const planeGeometry = new THREE.PlaneGeometry(20, 20);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2; // 바닥을 수평으로 설정
      scene.add(plane);

      // 렌더러 설정
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      if (threeContainer.value) {
        threeContainer.value.appendChild(renderer.domElement);
      }

      // 이벤트 핸들러 설정
      window.addEventListener('resize', onWindowResize);
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);

      // 카메라 제어용
      document.body.addEventListener('mousemove', onMouseMove);

      render();
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
      console.log(event.code);
    };

    const onKeyUp = (event) => {
      keyStates[event.code] = false;
    };

    const onMouseMove = (event) => {
      if (document.pointerLockElement === document.body) {
        camera.rotation.y -= event.movementX / 500;
        camera.rotation.x -= event.movementY / 500;
      }
    };

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      renderer.render(scene, camera);

      // 카메라 제어
      if (keyStates['KeyW']) {
        camera.position.z -= 0.05; // 앞쪽으로 이동
      }
      if (keyStates['KeyS']) {
        camera.position.z += 0.05; // 뒤로 이동
      }
      if (keyStates['KeyA']) {
        camera.position.x -= 0.05; // 좌로 이동
      }
      if (keyStates['KeyD']) {
        camera.position.x += 0.05; // 우로 이동
      }
      if (keyStates['Space']) {
        camera.position.y += 0.05; // 위로 이동
      }
      if (keyStates['ShiftLeft']) {
        camera.position.y -= 0.05; // 위로 이동
      }
    };

    onMounted(() => {
      initThree(); // 컴포넌트가 마운트되면 초기화
    });

    onUnmounted(() => {
      // 컴포넌트가 언마운트되면 정리 작업
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.body.removeEventListener('mousemove', onMouseMove);
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
