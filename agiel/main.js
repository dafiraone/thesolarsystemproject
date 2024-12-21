import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MTLLoader } from "three/examples/jsm/Addons.js";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import PLANETS from "./planets";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const clock = new THREE.Clock();
let isAnimating = false;
let animationStartTime = 0;
const animationDuration = 1.5; // Duration in seconds
let initialCameraPosition = new THREE.Vector3();
let targetCameraPosition = new THREE.Vector3();
let initialControlsTarget = new THREE.Vector3();
let targetControlsTarget = new THREE.Vector3();

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("./planet_sound_asset.ogg", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
});

const planetObjects = [];
for (const planet of PLANETS) {
  const mtlLoader = new MTLLoader();
  mtlLoader.load(`/${planet.name}/materials.mtl`, (materials) => {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(`/${planet.name}/model.obj`, (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      object.position.x = planet.distance;

      if (planet.resizeScale) {
        object.scale.setScalar(planet.resizeScale);
      } else {
        object.scale.setScalar(planet.scale);
      }

      object.name = planet.name;
      scene.add(object);

      // const axesHelper = new THREE.AxesHelper(2)
      // object.add(axesHelper)

      planetObjects.push(object);

      window.addEventListener("click", (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(object, true);

        if (intersects.length > 0) {
          // console.log(object.name)
          // camera.lookAt(object.position)
          // camera.position = object.position
          // controls.target.copy(object.position)
          isAnimating = true;
          animationStartTime = clock.getElapsedTime();
          initialCameraPosition.copy(camera.position);
          targetCameraPosition.copy(object.position).add(new THREE.Vector3(0, 0, 4));
          initialControlsTarget.copy(controls.target);
          targetControlsTarget.copy(object.position);
        }
      });
    });
  });
}

const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffff00, 10);
pointLight.position.set(0, 0, 0);

const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const positions = new Float32Array(starCount * 3); // 3 coordinates per star

for (let i = 0; i < starCount; i++) {
  const x = Math.random() * 1000 - 500;
  const y = Math.random() * 1000 - 500;
  const z = Math.random() * 1000 - 500;
  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.5 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const canvas = document.getElementById("threejs");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio, 2);

const controls = new OrbitControls(camera, canvas);
controls.enablePan = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// HTML Element for Intro
const introOverlay = document.createElement("div");
introOverlay.style.position = "absolute";
introOverlay.style.top = "0";
introOverlay.style.left = "0";
introOverlay.style.width = "100%";
introOverlay.style.height = "100%";
introOverlay.style.backgroundColor = "rgba(0, 0, 0, 1)";
introOverlay.style.display = "flex";
introOverlay.style.flexDirection = "column";
introOverlay.style.alignItems = "center";
introOverlay.style.justifyContent = "center";
introOverlay.style.color = "#ffffff";
introOverlay.style.fontFamily = "Arial, sans-serif";
introOverlay.style.fontSize = "2.5rem";
introOverlay.style.textAlign = "center";
introOverlay.style.zIndex = "10";
introOverlay.style.transition = "opacity 2s ease";

// Add content to the intro
const introText = document.createElement("div");
introText.innerText = "Selamat Datang di Sistem Tata Surya";
introText.style.animation = "zoomIn 2s ease-out forwards";
introOverlay.appendChild(introText);

const clickText = document.createElement("div");
clickText.innerText = "Klik untuk memulai!";
clickText.style.marginTop = "20px";
clickText.style.fontSize = "1.5rem";
clickText.style.opacity = "0";
clickText.style.animation = "fadeIn 2s 1s ease-out forwards";
introOverlay.appendChild(clickText);

document.body.appendChild(introOverlay);

// Initial Camera Position (far away)
camera.position.set(0, 0, 100);

// Keyframe Animations (using CSS)
const style = document.createElement("style");
style.innerHTML = `
  @keyframes zoomIn {
    0% { transform: scale(0.5); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
`;
document.head.appendChild(style);

// Intro Click Event
introOverlay.addEventListener("click", () => {
  const audioContext = THREE.AudioContext.getContext();
  if (audioContext.state === "suspended") {
    audioContext.resume().then(() => {
      console.log("AudioContext resumed");
    });
  }
  // Start animation to move camera closer to the scene
  isAnimating = true;
  animationStartTime = clock.getElapsedTime();
  initialCameraPosition.copy(camera.position);
  targetCameraPosition.set(0, 0, 5); // Closer to planets
  initialControlsTarget.copy(controls.target);
  targetControlsTarget.set(0, 0, 0); // Center of the scene

  sound.play();

  // Trigger fade out and remove intro overlay after animation
  introOverlay.style.animation = "fadeOut 1.5s ease-out";
  setTimeout(() => {
    introOverlay.style.display = "none";
  }, 1500);
});

const renderLoop = () => {
  if (isAnimating) {
    const elapsedTime = clock.getElapsedTime() - animationStartTime;
    const t = Math.min(elapsedTime / animationDuration, 1); // Normalized time [0, 1]

    // Smoothstep interpolation
    const smoothStep = t * t * (3 - 2 * t);

    // Interpolate camera position
    camera.position.lerpVectors(initialCameraPosition, targetCameraPosition, smoothStep);

    // Interpolate controls target
    controls.target.lerpVectors(initialControlsTarget, targetControlsTarget, smoothStep);

    // End animation when complete
    if (t >= 1) {
      isAnimating = false;
    }
  }

  planetObjects.forEach((planet, index) => {
    planet.rotation.y += PLANETS[index].speed;
    planet.position.x = Math.sin(planet.rotation.y) * PLANETS[index].distance;
    planet.position.z = Math.cos(planet.rotation.y) * PLANETS[index].distance;
  });

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();
