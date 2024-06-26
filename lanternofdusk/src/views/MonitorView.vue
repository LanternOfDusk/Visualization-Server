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
    const scene = new THREE.Scene(); // 장면 생성
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 카메라 생성
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // 랜더러 생성
    const keyStates = {}; // 키 입력 배열 생성
    const dots = {}; // 점 배열 생성
    const markers = []; // 마커 배열 생성
    let frameId // 프레임 아이디 생성

    const initThree = () => {
      // 장면 세부설정
      scene.background = new THREE.Color(0xffffff);
      
      // 카메라 세부설정
      camera.position.set(0, 20, 80);
      camera.rotation.order = 'YXZ';

      // 랜더러 세부설정
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      if (threeContainer.value) {
        threeContainer.value.appendChild(renderer.domElement);
      }
      
      // 조명 설정 및 생성
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

      // 바닥 그리드 로드
      const grid = new THREE.GridHelper(1600, 320);
      scene.add( grid );
      
      // 건물 모델 로드
      const loader = new ThreeMFLoader();
      const modelUrl = new URL('../assets/medialabs.3mf', import.meta.url).href;
      loader.load(modelUrl, function ( model ) {
        model.rotation.set( - Math.PI / 2, 0, Math.PI / 2 );
        model.scale.set(27,27,27);
        model.traverse(function (child) {
          if (child.isMesh) {
            const material = child.material.clone();
            material.transparent = true;
            material.opacity = 0.3;
            child.material = material;
            child.renderOrder = 1; // 렌더 순서 설정
          }
        });
        scene.add(model);
      });

      // 이벤트 등록
      window.addEventListener('resize', onWindowResize);
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('click', onClick);      
    };
    
    // 화면 크기 변경 시 랜더러&카메라 설정
    const onWindowResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    // 키 입력 설정
    const onKeyDown = (event) => {
      if (event.code == 'KeyM') {
        addMarker(camera.position);
        createMarker(camera.position);
      }
      else {
        keyStates[event.code] = true;
      }
    };
    const onKeyUp = (event) => {
      keyStates[event.code] = false;
    };
    // 마우스 입력 설정
    const onMouseMove = (event) => {
      if (document.pointerLockElement === document.body) {
        camera.rotation.y -= event.movementX / 700;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x - event.movementY / 700));
      }
    };
    const onClick = (event) => {
      if (document.pointerLockElement === null && event.target === renderer.domElement) {
        document.body.requestPointerLock();
      }
      else {
        document.exitPointerLock();
      }
    };

    // 랜더링 루프
    const render = () => {
      updateCamera();

      for (const key in dots) {
        animateDot(key);
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    // 카메라 이동
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

    // 위치 표시자 애니메이션 설정
    const animateDot = (ae) => {
      if (dots[ae].animation.lost) {
        dots[ae].dot.material.color.set(0x808080);     
      }
      else {
        dots[ae].dot.material.color.set(0xff0000);
      }

      if (dots[ae].dot.material.opacity > 1) {
        dots[ae].dot.material.opacity = 1;
        dots[ae].animation.increase = false;
        dots[ae].animation.frame = 0;
      }

      if (dots[ae].dot.material.opacity < 0) {
        dots[ae].dot.material.opacity = 0;
        dots[ae].animation.increase = true;
        dots[ae].animation.frame = 0;
      }
      
      if (dots[ae].dot.material.opacity == 0) {
        //getDataViaMobius(ae);
        dots[ae].dot.position.set(dots[ae].data.x, dots[ae].data.y, dots[ae].data.z);

        if (dots[ae].data.timestamp == dots[ae].lastUpdate) {
          dots[ae].animation.lost = true;
        }
        else {
          dots[ae].animation.lost = false;
        }
      }

      if (dots[ae].animation.increase) {
        dots[ae].dot.material.opacity += bezierCurves(dots[ae].animation.frame);
      }
      else {
        dots[ae].dot.material.opacity -= bezierCurves(dots[ae].animation.frame);
      }
      dots[ae].animation.frame++;
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

    // 위치 표시자 생성
    const setDots = () => {
      axios
      .get('http://58.120.21.139:7777/api/connection/list')
      .then((response) => {
        for (const device of response.data) {
          addDot(device.ae);
          console.log(device.ae);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }

    const addDot = (ae) => {
      const geometry = new THREE.SphereGeometry( 5, 32, 16 );
      const material = new THREE.MeshPhongMaterial({ 
        color: 0xff0000, 
        transparent: true,
        opacity: 0 
      });
      const dot = new THREE.Mesh(geometry, material);
      scene.add(dot);

      dots[ae] = {
        dot: dot,
        lastUpdate: 0,
        data: {
          x : 0,
          y : 0,
          z : 0,
          timestamp : 0
        },
        animation: {
          increase : true,
          frame : 0,
          lost : false
        }
      }
    }
    // const getDataViaMobius = (ae) => {
    //   axios
    //   .get("http://203.253.128.177:7579/Mobius/" + ae + "/DATA/la", {
    //     headers: {
    //       "Accept": "application/json",
    //       "X-M2M-RI": "12345",
    //       "X-M2M-Origin": "SOrigin"
    //     }
    //   })
    //   .then((response) => {
    //     dots[ae].lastUpdate = dots[ae].data.timestamp
    //     dots[ae].data.x = response.data['m2m:cin'].con.px;
    //     dots[ae].data.y = response.data['m2m:cin'].con.py;
    //     dots[ae].data.z = response.data['m2m:cin'].con.pz;
    //     dots[ae].data.timestamp = response.data['m2m:cin'].con.timestamp;
    //   })
    // }
    const getDataViaWebSoket = () => {
      const ws = new WebSocket('ws://58.120.21.139:7777/ws?type=client');
      
      ws.onopen = () => {
        console.log('WebSocket connected!');
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { ae, px, py, pz, timestamp } = data;
        
        dots[ae].lastUpdate = dots[ae].data.timestamp
        dots[ae].data.x = px;
        dots[ae].data.y = py;
        dots[ae].data.z = pz;
        dots[ae].data.timestamp = timestamp;
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected.');
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    const setMarkers = () => {
      axios
      .get('http://58.120.21.139:7777/api/marker/list')
      .then((response) => {
        for (const data of response.data) {
          addMarker(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
    const addMarker = (position) => {
      const geometry = new THREE.SphereGeometry( 5, 20, 20 );
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      const marker = new THREE.Mesh(geometry, material);
      marker.position.set(position.x, position.y, position.z);
      scene.add(marker);

      markers.push = {
        name: position.name,
        mesh: marker
      }
    }
    const createMarker = (position) => {
      try {
        axios.post('http://58.120.21.139:7777/api/marker', 
          { 
            name:'('+parseInt(position.x)+','+parseInt(position.y)+','+parseInt(position.z)+')', 
            x:position.x, 
            y:position.y, 
            z:position.z
          }
        );
      } catch (error) {
        console.error('마커를 생성하는 중 오류 발생:', error);
      }
    }

    onMounted(() => {
      initThree();
      getDataViaWebSoket();
      render(); 
      setDots();
      setMarkers();
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

      for (const key in dots) {
        clearInterval(dots[key].animation.loop);
      }
    });

    return {
      threeContainer,
    };
  },
};
</script>