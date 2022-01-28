import './style.css'
import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shader/vertexPoint.glsl';
import fragmentShader from './shader/fragment.glsl';
import gsap from 'gsap';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js'


// const videoWebM = document.querySelector('.video.webm')
// videoWebM.play();
// const videoTextureWebm = new THREE.VideoTexture(videoWebM)

let materialMpShader;

const videoMP = document.querySelector('.video.mp')
videoMP.play()
const videoTextureMP = new THREE.VideoTexture(videoMP)

// const videoM4v = document.querySelector('.video.m4v')
// videoM4v.play();
// const videoTextureM4v = new THREE.VideoTexture(videoM4v)

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()


// const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
// const materialWebM = new THREE.MeshBasicMaterial({
//   map: videoTextureWebm,
// });
// const meshwebM = new THREE.Mesh(geometry, materialWebM)
// meshwebM.position.set(-2, 0, -5);
// scene.add(meshwebM)

// const materialMp = new THREE.MeshBasicMaterial({
//   map: videoTextureMP,
// });
// const meshMP = new THREE.Mesh(geometry, materialMp)
// meshMP.position.set(0, 0, -5);
// scene.add(meshMP)

// //shader material


// //

// const materialM4v = new THREE.MeshBasicMaterial({
//   map: videoTextureM4v,
// });
// const meshM4v = new THREE.Mesh(geometry, materialM4v)
// meshM4v.position.set(2, 0, -5);
// scene.add(meshM4v)


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.xr.enabled = true;

const controller = renderer.xr.getController(0);
controller.addEventListener('select', onSelect);
scene.add(controller);

const button = ARButton.createButton(renderer, {
  optionalFeatures: ["dom-overlay", "dom-overlay-for-handheld-ar"],
  domOverlay: {
    root: document.body
  }
});
document.body.appendChild(button);

//attach a click listener to a play button
button.addEventListener('click', async () => {
  console.log('hi');
  if (!audioIsInitialized) { // one time setup
    await setupAudio();
  
  } else {
    toggleAudio(); 
  }
})



let listener;
let sound;

async function setupAudio() {
  // create an AudioListener and add it to the camera
  listener = new THREE.AudioListener();
  camera.add(listener);

  // create audio sound and sphere
  await createPositionalAudio();
  // finally add the sound to the mesh
}


async function createPositionalAudio() {
  sound = new THREE.PositionalAudio(listener);
  sound.setRefDistance(0.1); // the distance between sound and listener at which the volume reduction starts taking effect.
  sound.setDistanceModel('linear'); // this has to be linear for the max distance to work
  sound.setMaxDistance(1.5); // more settings here: https://threejs.org/docs/#api/en/audio/PositionalAudio
  sound.setLoop(true);
  // Good definitions for what each of these are at
  // https://stackoverflow.com/questions/36706118/use-three-js-positionalaudio-to-make-a-cone-of-sound
  // coneInnerAngle, coneOuterAngle, coneOuterGain (from 0-1, 0 means no audio outside of cone)
  sound.setDirectionalCone(180, 230, 0);
  
  // load a sound and set it as the PositionalAudio object's buffer
  const audioLoader = new THREE.AudioLoader();
  // do not load a music file as ogg, won't play in Firefox
  const url = '/alan_watts_short.mp3';
  const buffer = await audioLoader.loadAsync(url);
  sound.setBuffer(buffer);

  // optional helper to visualize the cone shape
  const helper = new PositionalAudioHelper(sound);
  sound.add(helper);        
}

function startAudio() {
  sound.play();
  console.log(sound);
  audioIsPlaying = true;
}

function stopAudio() {
  sound.stop();
  audioIsPlaying = false;
}

let audioIsInitialized = false;
let audioIsPlaying = false;

function toggleAudio() {
  if (audioIsInitialized) {
    if (!audioIsPlaying) {
      playAudio();
    } else {
      stopAudio();
    }
  }
}


function onSelect() {
  const geometryShader = new THREE.BoxGeometry(1.3, 1, 0.05, 480 / 2, 360 / 2, 480 / 2);
   materialMpShader = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uPointSize: { value: 10 },
      uRange: { value: 0 },
      uTexture: { value: videoTextureMP },
      uResolution: { value: new THREE.Vector4() }

    }
  });
  const meshMPShader = new THREE.Points(geometryShader, materialMpShader)
  meshMPShader.scale.multiplyScalar(0.2)
  meshMPShader.position.set(0, 0, - 0.5).applyMatrix4(controller.matrixWorld);
  meshMPShader.quaternion.setFromRotationMatrix(controller.matrixWorld);

  scene.add(meshMPShader);
  audioIsInitialized = true;
  startAudio();
  console.log("start audio");
  meshMPShader.add(sound)
}

//animate shader
// function animateVideo() {
// if(materialMpShader) {
//   gsap.to(materialMpShader.uniforms.uRange, {
//     duration: 5,
//     value: 0,
//     onComplete: () => {
//       videoMP.play()
//     }
//   })
//   gsap.to(materialMpShader.uniforms.uPointSize, {
//     delay: 2,
//     duration: 10,
//     value: 8.0
//   })
// }
// }

  videoMP.addEventListener('ended', () => {
    if(materialMpShader) {
    gsap.to(materialMpShader.uniforms.uRange, {
      delay: 0.2,
      duration: 30,
      value: 4
    })
    gsap.to(materialMpShader.uniforms.uPointSize, {
      delay: 1,
      duration: 30,
      value: 5.0
    })
    gsap.to(materialMpShader.uniforms.uPointSize, {
      delay: 31,
      duration: 30,
      value: 2.0
    })
    gsap.to(materialMpShader.uniforms.uRange, {
      delay: 40,
      duration: 90,
      value: 10
    })
  }
  })
  


const clock = new THREE.Clock()

function animate() {
  renderer.setAnimationLoop(update);
}

function update() {
  const elapsedTime = clock.getElapsedTime()
  
  // meshwebM.rotation.y = elapsedTime * 0.5
  // meshMP.rotation.y = elapsedTime * 0.5
  // meshM4v.rotation.y = elapsedTime * 0.5

  renderer.render(scene, camera);
}

animate()
// animateVideo()