import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const video = document.querySelector('.video')
const videoTexture = new THREE.VideoTexture(video)

//scene content
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: videoTexture },
      uLengthStripX: {value: 0.99},
      uLengthStripY: {value: 0.99},
      uWidthStripX: {value: 0.99},
      uWidthStripY: {value: 0.99},
      uNumberOfStrips: {value: 25},
    }
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


gsap.to(material.uniforms.uLengthStripX, {
  duration: 20,
  value: 0.01,
  delay: 3
})
gsap.to(material.uniforms.uLengthStripY, {
  duration: 15,
  value: 0.01,
  delay: 10
})
gsap.to(material.uniforms.uWidthStripX, {
  duration: 20,
  value: 0.7,
  delay: 25
})
gsap.to(material.uniforms.uWidthStripY, {
  duration: 25,
  value: 0.4,
  delay: 30
})
gsap.to(material.uniforms.uWidthStripX, {
  duration: 10,
  value: 0.1,
  delay: 35
})


const clock = new THREE.Clock()

const animate = () =>
{
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.uTime.value = elapsedTime * 0.3

    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)
}

animate()