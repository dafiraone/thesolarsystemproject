import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Dark background

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25;

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);  // Make renderer fullscreen
document.body.appendChild(renderer.domElement);

// Create the Sun (bright yellow)
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Sun color
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Function to create planets
function createPlanet(size, color, distance, name) {
  const geometry = new THREE.SphereGeometry(size, 16, 16);
  const material = new THREE.MeshLambertMaterial({ color: color });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = distance;
  planet.name = name; // Set the planet's name
  planet.userData = { name: name }; // Add planet name to userData for easier access
  return planet;
}

// Create planets from Mercury to Neptune
const mercury = createPlanet(0.4, 0x6e6e6e, 5, 'Mercury');
const venus = createPlanet(0.95, 0xffcc66, 7, 'Venus');
const earth = createPlanet(1, 0x0000ff, 10, 'Earth');
const mars = createPlanet(0.53, 0xff6347, 12, 'Mars');
const jupiter = createPlanet(2.3, 0xd78f4c, 16, 'Jupiter');
const saturn = createPlanet(2.5, 0xffd700, 20, 'Saturn');
const uranus = createPlanet(1.8, 0x7fbf7f, 25, 'Uranus');
const neptune = createPlanet(1.7, 0x0000ff, 30, 'Neptune');

// Add planets to the scene
scene.add(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);

// Optional: Add a ring to Saturn
const ringGeometry = new THREE.RingGeometry(2.7, 3, 32);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xc2b280, side: THREE.DoubleSide });
const saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);
saturnRings.rotation.x = Math.PI / 2;
saturn.add(saturnRings);

// Add ambient light to scene
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// Add a point light to represent the Sun
const pointLight = new THREE.PointLight(0xffffff, 1.5, 50);
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

// Create stars (background)
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

starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.5 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Set up raycasting for clicking
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for mouse clicks
window.addEventListener('click', onMouseClick, false);

// Handle mouse click
function onMouseClick(event) {
  // Convert mouse position to normalized device coordinates (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the new mouse position
  raycaster.update(camera, renderer.domElement);  // This line is corrected

  // Check for intersections with planets
  const intersects = getIntersectedObjects();

  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    animatePlanet(selectedObject);
    showPlanetInfo(selectedObject);
  }
}

// Get intersected objects (planets)
function getIntersectedObjects() {
  return raycaster.intersectObjects([sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune]); // Include all the planets
}

// Create the description card
const cardContainer = document.createElement('div');
cardContainer.style.position = 'absolute';
cardContainer.style.top = '10px';
cardContainer.style.right = '10px';
cardContainer.style.padding = '20px';
cardContainer.style.background = 'rgba(0, 0, 0, 0.8)';
cardContainer.style.color = 'white';
cardContainer.style.borderRadius = '8px';
cardContainer.style.display = 'none'; // Initially hidden
document.body.appendChild(cardContainer);

// Create the planet container on the left side
const planetContainer = document.createElement('div');
planetContainer.style.position = 'absolute';
planetContainer.style.left = '10px';
planetContainer.style.bottom = '10px';
planetContainer.style.width = '300px';
planetContainer.style.height = '300px';
planetContainer.style.background = 'rgba(0, 0, 0, 0.8)';
planetContainer.style.borderRadius = '8px';

planetContainer.style.display = 'none'; // Initially hidden
document.body.appendChild(planetContainer);

// Show planet information when clicked
function showPlanetInfo(planet) {
  let info = '';

  switch (planet.name) {
    case 'Mercury':
      info = 'Mercury: The closest planet to the Sun. It has a very thin atmosphere and extreme temperatures.';
      break;
    case 'Venus':
      info = 'Venus: Known as Earth\'s twin. It has a thick atmosphere and surface temperatures high enough to melt lead.';
      break;
    case 'Earth':
      info = 'Earth: The only planet known to support life. It has a breathable atmosphere and abundant water.';
      break;
    case 'Mars':
      info = 'Mars: Known as the Red Planet due to its reddish appearance. It has a thin atmosphere and ice caps.';
      break;
    case 'Jupiter':
      info = 'Jupiter: The largest planet in the solar system. It has a stormy atmosphere, including the Great Red Spot.';
      break;
    case 'Saturn':
      info = 'Saturn: Known for its beautiful ring system, Saturn is a gas giant with dozens of moons.';
      break;
    case 'Uranus':
      info = 'Uranus: A gas giant with a tilted rotation axis, giving it unique seasons and weather patterns.';
      break;
    case 'Neptune':
      info = 'Neptune: The farthest planet from the Sun. It has strong winds and a deep blue color.';
      break;
    default:
      info = 'Sun: The center of the solar system. It is a star that provides light and energy to all the planets.';
      break;
  }

  // Update and display the card with planet info
  planetContainer.style.display = 'block'; // Show planet

  // Animate planet to the left side
  animatePlanet(planet);
}

// Animate planet movement
function animatePlanet(planet) {
  // Animate the planet to the left side (you can adjust this to suit your needs)
  new TWEEN.Tween(planet.position)
    .to({ x: -10, y: 0, z: 0 }, 2000) // Move to the left (adjust coordinates)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
}

// Create orbit controls for easy camera movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Render loop
function animate() {
  // Rotate planets around the Sun
  mercury.rotation.y += 0.01;
  venus.rotation.y += 0.01;
  earth.rotation.y += 0.01;
  mars.rotation.y += 0.01;
  jupiter.rotation.y += 0.01;
  saturn.rotation.y += 0.01;
  uranus.rotation.y += 0.01;
  neptune.rotation.y += 0.01;

  // Planets orbiting the Sun (simplified)
  mercury.position.x = 5 * Math.cos(Date.now() * 0.001);
  mercury.position.z = 5 * Math.sin(Date.now() * 0.001);

  venus.position.x = 7 * Math.cos(Date.now() * 0.0007);
  venus.position.z = 7 * Math.sin(Date.now() * 0.0007);

  earth.position.x = 10 * Math.cos(Date.now() * 0.0005);
  earth.position.z = 10 * Math.sin(Date.now() * 0.0005);

  mars.position.x = 12 * Math.cos(Date.now() * 0.0003);
  mars.position.z = 12 * Math.sin(Date.now() * 0.0003);

  jupiter.position.x = 16 * Math.cos(Date.now() * 0.0001);
  jupiter.position.z = 16 * Math.sin(Date.now() * 0.0001);

  saturn.position.x = 20 * Math.cos(Date.now() * 0.00008);
  saturn.position.z = 20 * Math.sin(Date.now() * 0.00008);

  uranus.position.x = 40 * Math.cos(Date.now() * 0.00005);
  uranus.position.z = 40 * Math.sin(Date.now() * 0.00005);

  neptune.position.x = 50 * Math.cos(Date.now() * 0.00003);
  neptune.position.z = 50 * Math.sin(Date.now() * 0.00003);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

