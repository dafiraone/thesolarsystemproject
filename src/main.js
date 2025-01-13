import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { MTLLoader } from 'three/examples/jsm/Addons.js'
import { OBJLoader } from 'three/examples/jsm/Addons.js'
import { Pane } from 'tweakpane'
import PLANETS from "./planets"
import planetInfo from "./planetInfo"
import Card from "./card"

const pane = new Pane()
const paneElement = pane.element
paneElement.style.display = "none"

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 7

const ambientLightPane = pane.addFolder({
  title: "Ambient Light",
  expanded: true
})
const ambientLight = new THREE.AmbientLight(0xffffff, 5)
ambientLightPane.addBinding(ambientLight, "intensity", {min: 1, max: 10, step: 0.01})
scene.add(ambientLight)

const pointLightPane = pane.addFolder({
  title: "Point Light",
  expanded: true
})

const orbitalRing = { visible: false, orbitting: false };

const pointLight = new THREE.PointLight(0xffff00, 0)
pointLight.position.set(0, 0, 0)
pointLightPane.addBinding(pointLight, "intensity", {min: 0.1, max: 100, step: 0.01})

camera.add(pointLight)
scene.add(camera)

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()

// Camera Transition
const clock = new THREE.Clock()
let isAnimating = false
let animationStartTime = 0
const animationDuration = 1.5
let initialCameraPosition = new THREE.Vector3()
let targetCameraPosition = new THREE.Vector3()
let initialControlsTarget = new THREE.Vector3()
let targetControlsTarget = new THREE.Vector3()

const audioContext = THREE.AudioContext.getContext()

// Audio
const listener = new THREE.AudioListener()
camera.add(listener)
// create a global audio source
const sound = new THREE.Audio(listener)
// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader()
audioLoader.load("./planet_sound_asset.ogg", function (buffer) {
  sound.setBuffer(buffer)
  sound.setLoop(true)
  sound.setVolume(1)
})

// Splash Screen
const splashScreen = document.createElement("div")
splashScreen.id = "splash-screen"

const introText = document.createElement("h1")
introText.innerText = "The Solar System"
introText.id = "intro-text"
splashScreen.append(introText)

const introText2 = document.createElement("p")
introText2.innerText = "Click to continue"
introText2.id = "intro-text2"
splashScreen.append(introText2)

camera.position.set(0, 0, 100)

let splashScreenActive = true;
splashScreen.style.pointerEvents = "none"; // Disable clicks initially

// Enable clicks after 1.5 seconds
setTimeout(() => {
  splashScreen.style.pointerEvents = "auto"; // Enable clicks
}, 1500);

splashScreen.addEventListener("click", () => {
  if (audioContext.state === "suspended") {
    audioContext.resume().then(() => {
      console.log("AudioContext resumed");
    });
  }
  // Start animation to move camera closer to the scene
  isAnimating = true;
  animationStartTime = clock.getElapsedTime();
  initialCameraPosition.copy(camera.position);
  targetCameraPosition.set(0, 0, 7); // Closer to planets
  initialControlsTarget.copy(controls.target);
  targetControlsTarget.set(0, 0, 0); // Center of the scene

  sound.play();

  // Trigger fade out and remove intro overlay after animation
  splashScreen.style.animation = "fadeOut 1.5s ease-out";
  setTimeout(() => {
    splashScreen.style.display = "none";
    splashScreenActive = false;
  }, 1500);
});


document.body.prepend(splashScreen)

const ring = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5})

const planetObjects = []
const orbitRings = []

for (const planet of PLANETS) {
  new MTLLoader().load(`./${planet.name}/materials.mtl`, (materials) => {
    materials.preload()

    new OBJLoader().setMaterials(materials)
        .load(`./${planet.name}/model.obj`, (object) => {

      object.position.x = planet.distance
      object.scale.setScalar(planet.scale)
      object.name = planet.name

      // if (planet.name === "Sun") {
      //   object.add(pointLight)
      // }

      scene.add(object)
      
      // const axesHelper = new THREE.AxesHelper(2)
      // object.add(axesHelper)
      
      planetObjects.push(object)

      const planetRingGeo = new THREE.TorusGeometry(planet.distance, 0.03, 128, 128)
      const planetRing = new THREE.Mesh(planetRingGeo, ring)
      planetRing.rotateX(Math.PI / 2)
      planetRing.visible = false
      scene.add(planetRing)
      orbitRings.push(planetRing)


      window.addEventListener('click', (e) => {
        if (splashScreenActive) return

        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  
        raycaster.setFromCamera(mouse, camera)

  
        const intersects = raycaster.intersectObject(object, true)
        if (intersects.length > 0) {
          // console.log(intersects[0].object.id)
          // selectedPlanet = intersects[0].object
          // isFollowing = true

          // console.log(object.name)
          // camera.lookAt(object.position)
          // camera.position = object.position
          // controls.target.copy(object.position)
          isAnimating = true
          animationStartTime = clock.getElapsedTime()
          initialCameraPosition.copy(camera.position)
          // targetCameraPosition.copy(object.position).add(new THREE.Vector3(0.5 * object.scale.x, 0, 4))
          targetCameraPosition.copy(object.position).add(new THREE.Vector3(0, 0, planet.zVector))
          // targetCameraPosition.copy(object.position).add(new THREE.Vector3(0, 0, 5))
          initialControlsTarget.copy(controls.target)
          targetControlsTarget.copy(object.position)

          orbitalRing.orbitting = false
          pane.refresh();
          
          planetInfo(planet, sound)
          // document.getElementById("close-planet-card").hidden = false
          document.getElementById("close-planet-card").style.display = "flex"
          document.getElementById("planet-card-left").hidden = false
          document.getElementById("planet-card-right").hidden = false
        }
      })
    })
  })
}

const orbitRingsPane = pane.addFolder({
  title: "Orbit Rings",
  expanded: true,
})


orbitRingsPane.addBinding(orbitalRing, "visible").on("change", (event) => {
  orbitRings.forEach((ring) => {
    ring.visible = event.value
  })
})

orbitRingsPane.addBinding(ring, "opacity", { min: 0.1, max: 1, step: 0.1 }).on("change", (event) => {
  orbitRings.forEach((ring) => {
    ring.material.opacity = event.value
  })
})

orbitRingsPane.addBinding(orbitalRing, "orbitting").on("change", (event) => {
    ring.visible != orbitalRing.orbitting
})

if (audioContext.state === "suspended") {
  audioContext.resume().then(() => {
    sound.play()
  })
}


// Star Background (randomized)
const starGeometry = new THREE.BufferGeometry()
const starCount = 5000
const positions = new Float32Array(starCount * 3) // 3 coordinates per star

for (let i = 0; i < starCount; i++) {
  const x = Math.random() * 1000 - 500;
  const y = Math.random() * 1000 - 500;
  const z = Math.random() * 1000 - 500;
  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const starMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.5 })
const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

Card()

const canvas = document.getElementById("threejs")
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio, 2)
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 2
controls.maxDistance = 30

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// === ONLY FOR TRAILER ===
// window.addEventListener("keydown", (event) => {
//   if (event.key === "z") {
//     isAnimating = true
//     animationStartTime = clock.getElapsedTime()
//     initialCameraPosition.copy(camera.position)
//     targetCameraPosition.set(0, 0, controls.maxDistance)
//     initialControlsTarget.copy(controls.target)
//     targetControlsTarget.set(0, 0, 0) 
//   }
// })

let handled = false;

document.addEventListener('keydown', (event) => {
  if (event.key === 'T' && event.shiftKey && !handled) {
    if (paneElement.style.display === 'none') {
      paneElement.style.display = 'block'
    } else {
      paneElement.style.display = 'none'
    }
    handled = true
  }
});

document.addEventListener('keyup', () => {
  handled = false
});


const renderLoop = () => {
  if (isAnimating) {
    const elapsedTime = clock.getElapsedTime() - animationStartTime
    const t = Math.min(elapsedTime / animationDuration, 1) // Normalized time [0, 1]
    const smoothStep = t * t * (3 - 2 * t) // Smoothstep interpolation

    camera.position.lerpVectors(initialCameraPosition, targetCameraPosition, smoothStep) // Interpolate camera position
    // camera.position.lerp(targetCameraPosition, 0.02)
    controls.target.lerpVectors(initialControlsTarget, targetControlsTarget, smoothStep) // Interpolate controls target
    // controls.target.lerp(targetControlsTarget, 0.02)

    // End animation when complete
    if (t >= 1) {
      isAnimating = false
    }
  }
  
  planetObjects.forEach((planet, index) => {
    if (!planet) return
    // console.log(planet.name, planet.position)
    planet.rotation.y += PLANETS[index].speed

    const sun = planetObjects.find(p => p.name === 'Sun').position
    // console.log(sun)

    if (sun.x !== 0 && sun.y !== 0 && sun.z !==0) {
      location.reload()
      return false
    }

    
    if (orbitalRing.orbitting) {
      planet.position.x = Math.sin(planet.rotation.y) * PLANETS[index].distance
      planet.position.z = Math.cos(planet.rotation.y) * PLANETS[index].distance
    }

  })

  controls.update()
  renderer.render(scene, camera)
}
renderer.setAnimationLoop(renderLoop)