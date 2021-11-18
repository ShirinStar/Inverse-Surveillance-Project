import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

let SVGMesh;
let geometry;
let material;
let positions;
let opacity;
let lines = [];
const SVGViewBox = 512;

const gui = new dat.GUI()

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


const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 10, 10000)
camera.position.z = 400
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// ///svg Tatreez///

const svg = [...document.querySelectorAll('.cls-1')]

svg.forEach((path, j) => {
  let len = path.getTotalLength()
  let numberOfPoints = Math.floor(len / 2)

  let points = []
  

  for (let i = 0; i < numberOfPoints; i++) {
    let pointAt = len * i / numberOfPoints //this will change based on the length and total number of the path
    let onePoint = path.getPointAtLength(pointAt)
    let randX = (Math.random() - 0.5) * 2
    let randY = (Math.random() - 0.5) * 2
    let randZ = (Math.random() - 0.5) * 5

    points.push(new THREE.Vector3(onePoint.x - SVGViewBox / 2 +randX,
       onePoint.y - SVGViewBox / 2 +randY,
       randZ))
  }

  lines.push({
    id: j,
    path: path,
    length: len,
    number: numberOfPoints,
    points: points,
    currentPos: 0,
    speed: 1
  })

  let maxPoints = points.length * 50;

  positions = new Float32Array(maxPoints * 3)
  opacity = new Float32Array(maxPoints)

  // lines.forEach(line => {
  //   line.points.forEach(p => {
  //     positions.push(p.x, p.y, p.z)
  //     opacity.push(Math.random());
  //   })
  // })

})


geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('opacity', new THREE.BufferAttribute(opacity, 1));


material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  depthTest: true,
  depthWrite: true,
  // alphaTest: 0.001,
  blending: THREE.AdditiveBlending
})


SVGMesh = new THREE.Points(geometry, material)

scene.add(SVGMesh)

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new THREE.Clock()

//animationg particles path
const updateTrails = () => {
  let j = 0;

  //accesing the object that was created with the svg load
  lines.forEach(line => {
    line.currentPos += line.speed
    line.currentPos = line.currentPos % line.number // keeping them inset : ;

    //showwing only 100 particles at a time
    for (let i = 0; i < 400; i++) {
      let index = (line.currentPos + i) % line.number
      let showPoint = line.points[index]
      //using additional index to loop over the path
      positions.set([showPoint.x, showPoint.y, showPoint.z], j * 3)
      opacity.set([i / 1000], j)
      j++
    }
  })
  //updating
  if (SVGMesh) {
    SVGMesh.geometry.attributes.position.array = positions
    SVGMesh.geometry.attributes.position.needsUpdate = true;
  }
}

const render = () => {
  renderer.render(scene, camera);
}

const animate = () => {
  controls.update()

  updateTrails()

  requestAnimationFrame(animate);

  render();
}

animate()