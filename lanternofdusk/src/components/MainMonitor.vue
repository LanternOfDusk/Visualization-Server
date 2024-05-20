<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import {ThreeMFLoader} from "three/examples/jsm/loaders/3MFLoader";
import axios from 'axios';

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
      scene.background = new THREE.Color(0xffffff);
      
      camera.position.set(0, 20, 80);
      camera.rotation.order = 'YXZ';

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      if (threeContainer.value) {
        threeContainer.value.appendChild(renderer.domElement);
      }

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

      const grid = new THREE.GridHelper(1600, 320);
      scene.add( grid );

      const loader = new ThreeMFLoader();
      const modelUrl = new URL('../assets/medialabs.3mf', import.meta.url).href;
      loader.load(modelUrl, function ( model ) {
        model.rotation.set( - Math.PI / 2, 0, Math.PI / 2 );
        model.scale.set(20,20,20);
        model.traverse(function (child) {
          if (child.isMesh) {
            const material = child.material.clone();
            material.transparent = true;
            material.opacity = 0.7;
            child.material = material;
            child.renderOrder = 1; // 렌더 순서 설정
          }
        });
        scene.add(model);
      });

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
      let speed = keyStates['ControlLeft'] ? 3 : 2;

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
        camera.position.y += 1;
      }
      if (keyStates['ShiftLeft']) {
        camera.position.y -= 1;
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

    const animateDot = (id) => {
      if (dots[id].animation.lost) {
        dots[id].point.material.color.set(0x0000ff);
        dots[id].rod.material.color.set(0x0000ff);
      }
      else {
        dots[id].point.material.color.set(0xff0000);
        dots[id].rod.material.color.set(0xff0000);
      }

      if (dots[id].point.material.opacity > 1) {
        dots[id].point.material.opacity = 1;
        dots[id].rod.material.opacity = 1;
        dots[id].animation.increase = false;
        dots[id].animation.frame = 0;
      }
      if (dots[id].point.material.opacity < 0) {
        dots[id].point.material.opacity = 0;
        dots[id].rod.material.opacity = 0;
        dots[id].animation.increase = true;
        dots[id].animation.frame = 0;
      }
      
      if (dots[id].point.material.opacity == 0) {
        if (dots[id].data.timestamp == dots[id].lastUpdate) {
          dots[id].animation.lost = true;
        }
        else {
          dots[id].animation.lost = false;
        }
        dots[id].point.position.set(dots[id].data.x, dots[id].data.y, dots[id].data.z);
        dots[id].rod.position.set(dots[id].data.x, dots[id].data.y + 5, dots[id].data.z);
        dots[id].rod.rotation.set(dots[id].data.rx, dots[id].data.ry, dots[id].data.rz);
      }

      if (dots[id].animation.increase) {
        dots[id].point.material.opacity += bezierCurves(dots[id].animation.frame);
        dots[id].rod.material.opacity += bezierCurves(dots[id].animation.frame);
      }
      else {
        dots[id].point.material.opacity -= bezierCurves(dots[id].animation.frame);
        dots[id].rod.material.opacity -= bezierCurves(dots[id].animation.frame);
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

    const setDots = () => {
      addDot(1);
      setInterval(() => {
        getData(1);
      }, 1000);
    }

    const addDot = (id) => {
      const geometry = new THREE.SphereGeometry(5, 32, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xff0000, 
        transparent: true,
        opacity: 0 
      });
      const point = new THREE.Mesh(geometry, material);
      scene.add(point);

      const rodGeometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 32);
      const rodMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff0000,
        transparent: true,
        opacity: 0 
       });
      const rod = new THREE.Mesh(rodGeometry, rodMaterial);
      rod.rotation.z = Math.PI / 2;
      scene.add(rod);
      
      dots[id] = {
        point: point,
        rod: rod,
        lastUpdate: 0,
        data: {
          id : id,
          x : 0,
          y : 0,
          z : 0,
          rx : 0,
          ry : 0,
          rz : 0,
          timestamp : 0
        },
        animation: {
          increase : true,
          frame : 0,
          lost : false
        }
      }
    }

    const getData = (id) => {
      axios
      .get('http://localhost:7777/api/device/position/test')
      .then((response) => {
        dots[id].data = response.data;
        console.log(response.data);
      })
      .catch(() => {
        console.log("nodata");
      })
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