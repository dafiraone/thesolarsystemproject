import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { MTLLoader } from 'three/examples/jsm/Addons.js'
import { OBJLoader } from 'three/examples/jsm/Addons.js'
import PLANETS from "./planets"
import planetInfo from "./planetInfo"

const scene = new THREE.Scene()

scene.background = new THREE.Color(0x000000);

// create planet track around the sun
// const mercuryRingGeo = new THREE.TorusGeometry(3, 0.01, 128, 128);
// const ring = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.1})
// const mercuryRing = new THREE.Mesh(mercuryRingGeo, ring);
// mercuryRing.rotateX(Math.PI / 2);
// scene.add(mercuryRing);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const clock = new THREE.Clock();
let isAnimating = false;
let animationStartTime = 0;
const animationDuration = 1.5; // Duration in seconds
let initialCameraPosition = new THREE.Vector3();
let targetCameraPosition = new THREE.Vector3();
let initialControlsTarget = new THREE.Vector3();
let targetControlsTarget = new THREE.Vector3();


const planetObjects = []
for (const planet of PLANETS) {
  const mtlLoader = new MTLLoader()
  mtlLoader.load(`/${planet.name}/materials.mtl`, (materials) => {
    materials.preload()

    const objLoader = new OBJLoader()
    objLoader.setMaterials(materials)
    objLoader.load(`/${planet.name}/model.obj`, (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      object.position.x = planet.distance
      object.scale.setScalar(planet.scale)

      object.name = planet.name
      scene.add(object)
      
      // const axesHelper = new THREE.AxesHelper(2)
      // object.add(axesHelper)

      planetObjects.push(object)


      window.addEventListener('click', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  
        raycaster.setFromCamera(mouse, camera)

  
        const intersects = raycaster.intersectObject(object, true)
        if (intersects.length > 0) {
          // console.log(object.name)
          // camera.lookAt(object.position)
          // camera.position = object.position
          // controls.target.copy(object.position)
          isAnimating = true;
          animationStartTime = clock.getElapsedTime();
          initialCameraPosition.copy(camera.position);
          // targetCameraPosition.copy(object.position).add(new THREE.Vector3(0.5 * object.scale.x, 0, 4));
          targetCameraPosition.copy(object.position).add(new THREE.Vector3(0, 0, planet.zVector));
          initialControlsTarget.copy(controls.target);
          targetControlsTarget.copy(object.position);
          
          planetInfo(planet)
          document.getElementById("planet-info").hidden = false
        }
      })
    })
  })
}


const div = document.createElement("div")
div.id = "planet-info"

const btnClose = document.createElement("button")
btnClose.type = "button"
btnClose.innerText = "X"
btnClose.id = "close-planet-info"

btnClose.addEventListener("click", (e) => {
    const ele = document.getElementById("planet-info")
    ele.hidden = true
})


const planetName = document.createElement("h1")
planetName.id = "planet-info-name"
planetName.innerText = "Sun"

const div1 = document.createElement("div")
div1.id = "topper"
div1.appendChild(planetName)
div1.appendChild(btnClose)

div.appendChild(div1)

document.body.prepend(div)





const ambientLight = new THREE.AmbientLight(0xffffff, 5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffff00, 10)
pointLight.position.set(0, 0, 0)

// Star Background
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
scene.add(stars)


const canvas = document.getElementById("threejs")
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio, 2)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

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
      planet.rotation.y += PLANETS[index].speed
      planet.position.x = Math.sin(planet.rotation.y) * PLANETS[index].distance
      planet.position.z = Math.cos(planet.rotation.y) * PLANETS[index].distance
  })

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(renderLoop)
}
renderLoop()