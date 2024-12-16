import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import gsap from 'gsap';

// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// Set up the renderer with anti-aliasing and higher quality settings
const renderer = new THREE.WebGLRenderer({
  antialias: true, // Enable anti-aliasing for smoother edges
  powerPreference: "high-performance"
});
renderer.setPixelRatio(window.devicePixelRatio); // Match the device pixel ratio for crisper rendering
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1c1c1a); // Set the background color to grey
renderer.physicallyCorrectLights = true; // Enable physically correct lighting
renderer.shadowMap.enabled = true; // Enable shadow maps
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use a soft shadow map for smoother shadows
renderer.outputEncoding = THREE.sRGBEncoding; // Use sRGB encoding for better color accuracy
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Use ACES Filmic Tone Mapping for more realistic colors
renderer.toneMappingExposure = 1.5; // Increase exposure to make lighting pop more
document.getElementById('three-container').appendChild(renderer.domElement);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(10, 10, 10);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 4096; // Increase shadow map resolution further
pointLight.shadow.mapSize.height = 4096;
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.position.set(-5, 5, 5);
spotLight.castShadow = true;
spotLight.angle = Math.PI / 6;
spotLight.shadow.mapSize.width = 8192; // Ultra-high resolution for shadows
spotLight.shadow.mapSize.height = 8192;
spotLight.shadow.radius = 5;
scene.add(spotLight);

// Set up a plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x383834 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

// Load the .obj and .mtl files
const mtlLoader = new MTLLoader();
mtlLoader.load('/Sun/materials.mtl', (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('/Sun/model.obj', (object) => {
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.position.set(0, 0, 0); // Adjust position if necessary
    scene.add(object);

    // Add raycasting functionality to the loaded object
    window.addEventListener('click', (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(object, true);
      if (intersects.length > 0) {
        const zoomTarget = {
          x: 0,
          y: 0,
          z: 2 // Adjust for zoom-in effect
        };
        gsap.to(camera.position, {
          x: zoomTarget.x,
          y: zoomTarget.y,
          z: zoomTarget.z,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            camera.lookAt(object.position);
            controls.update();
          }
        });
        controls.target.copy(object.position);
      }
    });
  });
});

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = true;
controls.panSpeed = 1.0;

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize handler to adjust the scene when the window size changes
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});