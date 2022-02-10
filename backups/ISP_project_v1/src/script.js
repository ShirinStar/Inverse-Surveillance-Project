import './style.css'
import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import gsap from 'gsap';
import VideoNoise from './content/VideoNoise';
import VideoStitch from './content/VideoStitch';

let videoCount = 0;

let videoOne = null
const videoOneClassName = '.video.one'
const audioOne = '../audio/alan_watts_short.mp3'

let videoTwo = null
const videoTwoClassName = '.video.two'
const audioTwo = '../audio/nina.mp3'

let videoThree = null
const videoThreeClassName = '.video.three'
const audioThree = '../audio/Lynch.mp3'

//setup
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

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
button.style.backgroundColor = '#155C4D'

const titles = document.querySelector('.enteringTitles')

button.addEventListener('click', async () => {
  console.log('enter AR');
  titles.style.display = 'none'

  if (videoOne || videoTwo || videoThree) {
    videoOne.stopAudio()
    videoTwo.stopAudio()
    videoThree.stopAudio()
  }
})


function onSelect() {
  if (videoCount === 0) {
    videoOne = new VideoNoise(camera, videoOneClassName, audioOne)
    videoOne.video.play()

    const mesh = videoOne.videoNoiseMesh
    mesh.scale.multiplyScalar(0.4)
    mesh.position.set(0, 0, - 0.2).applyMatrix4(controller.matrixWorld);
    mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
    scene.add(mesh);

    mesh.add(videoOne.sound)
    videoCount++
  }
  else if (videoCount === 1) {
    videoTwo = new VideoNoise(camera, videoTwoClassName, audioTwo)
    videoTwo.video.play()

    const mesh = videoTwo.videoNoiseMesh
    mesh.scale.multiplyScalar(0.4)
    mesh.position.set(0, 0, - 0.2).applyMatrix4(controller.matrixWorld);
    mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
    scene.add(mesh);

    mesh.add(videoTwo.sound)
    videoCount++
  }
  else if (videoCount === 2) {
    videoThree = new VideoStitch(camera, videoThreeClassName, audioThree)
    videoThree.video.play()

    const mesh = videoThree.videoStitchMesh
    mesh.scale.multiplyScalar(0.15)
    mesh.position.set(0, 0, - 0.2).applyMatrix4(controller.matrixWorld);
    mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
    scene.add(mesh);

    mesh.add(videoThree.sound)
    videoCount++
  }
}


const clock = new THREE.Clock()

function animate() {
  renderer.setAnimationLoop(update);
}

function update() {
  const elapsedTime = clock.getElapsedTime()

  if (videoOne !== null) {
    videoOne.videoNoiseMaterial.uniforms.uTime.value = elapsedTime
  }

  if (videoTwo !== null) {
    videoTwo.videoNoiseMaterial.uniforms.uTime.value = elapsedTime
  }

  if (videoThree !== null) {
    videoThree.videoStitchMaterial.uniforms.uTime.value = elapsedTime * 0.2
  }

  renderer.render(scene, camera);
}

animate()
