<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import {ThreeMFLoader} from "three/examples/jsm/loaders/3MFLoader";

export default {
  name: 'MainMonitor',
  setup() {
    const threeContainer = ref(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const keyStates = {};
    const dots = {};

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

      const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 0.1 );
      hemiLight.position.set( 0, 100, 0 );
      scene.add( hemiLight );

      const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
      dirLight.position.set( - 0, 40, 50 );
      dirLight.castShadow = true;
      dirLight.shadow.camera.top = 50;
      dirLight.shadow.camera.bottom = - 25;
      dirLight.shadow.camera.left = - 25;
      dirLight.shadow.camera.right = 25;
      dirLight.shadow.camera.near = 0.1;
      dirLight.shadow.camera.far = 200;
      dirLight.shadow.mapSize.set( 1024, 1024 );
      scene.add( dirLight );


      // 바닥 설정
      const grid = new THREE.GridHelper(200, 40);
      scene.add( grid );

      const loader = new ThreeMFLoader();
      const modelUrl = new URL('../assets/test.3mf', import.meta.url).href;
      loader.load(modelUrl, function ( model ) {
        model.rotation.set( - Math.PI / 2, 0, Math.PI / 2 );
        model.position.set(0, 0, 100);
        model.scale.set(8,8,8);
        scene.add(model);
      });

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
      updateCamera();
      for (const key in dots) {
        animateDot(key);
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
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
      addDot(1);
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
      dots[id] = {
        point: point,
        lastUpdate: 0,
        animation: {
          increase : true,
          frame : 0
        }
      }
    }

    const animateDot = (id) => {
      if (dots[id].point.material.opacity > 1) {
        dots[id].point.material.opacity = 1;
        dots[id].animation.increase = false;
        dots[id].animation.frame = 0;
      }
      if (dots[id].point.material.opacity < 0) {
        dots[id].point.material.opacity = 0;
        dots[id].animation.increase = true;
        dots[id].animation.frame = 0;
      }
      
      if (dots[id].point.material.opacity <= 0) {
        let data = getData(id);
        dots[id].point.position.set(data[0], data[1], data[2]);
      }

      if (dots[id].animation.increase) {
        dots[id].point.material.opacity += bezierCurves(dots[id].animation.frame);
      }
      else {
        dots[id].point.material.opacity -= bezierCurves(dots[id].animation.frame);
      }

      dots[id].animation.frame++;
    }

    function bezierCurves(frame) {
      const t = frame / 200;

      const ps = { t : 0, y : 0 };
      const p0 = { t : 20, y : 0.1 };
      const p1 = { t : 150, y : 0.9 };
      const pe = { t : 200, y : 1 };

      const mt = 1 - t;
      const mt2 = Math.pow(mt, 2);
      const mt3 = Math.pow(mt, 3);
      const t2 = Math.pow(t, 2);
      const t3 = Math.pow(t, 3);

      return mt3 * ps.y + 3 * mt2 * t * p0.y + 3 * mt * t2 * p1.y + t3 * pe.y;
    }

    function getData(id) {
      
      return [0,id,0];
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
  width: 100vw;
  height: 100vh;
}
</style>