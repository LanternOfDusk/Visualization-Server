<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

export default {
  name: 'MainMonitor',
  setup() {
    const threeContainer = ref(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const keyStates = {};

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

    const setDots = () => {
      addDot(2);
      addDot(5);
      addDot(7);
    }

    const addDot = (id) => {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xff0000, 
        transparent: true,
        opacity: 0 
      });
      const point = new THREE.Mesh(geometry, material);
      scene.add(point);

      animateDot(point, id);
    }

    const animateDot = (point, id) => {
      let increase = true;
      setInterval(() => {
        if (point.material.opacity > 1 || point.material.opacity < 0) {
          increase = !increase;
        }
        if (point.material.opacity <= 0) {
          let data = getData(id);
          point.position.set(data[0], data[1], data[2]);
        }

        if (increase) point.material.opacity += 0.01;
        else point.material.opacity -= 0.01;
      }, 10);
    }

    let index = 0;
    function getData(id) {
      index++;
      return [0,id + index,0];
    }

    onMounted(() => {
      initThree();
      render(); 
      setDots();
    });

    onUnmounted(() => {
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