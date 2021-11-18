import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

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
camera.position.z = 600
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// ///svg Tatreez///
///option1//
const loader = new SVGLoader();

loader.load(
  'tatreez512.svg',
  // called when the resource is loaded
  function (data) {

    const paths = data.paths;

    let points = []

    let maxPoints = paths.length * 100;

    positions = new Float32Array(maxPoints * 3)
    opacity = new Float32Array(maxPoints)

    //adding randomness to the position 
    let randX = (Math.random() - 0.5) * 30
    let randY = (Math.random() - 0.5) * 30
    let randZ = (Math.random() - 0.5) * 30

    //accessing the x,y of tthe path and pushing them to the array
    paths.forEach(line => {
      line.subPaths.forEach(currentPoint => {
        points.push(
          new THREE.Vector3(
            currentPoint.currentPoint.x - SVGViewBox / 2 + randX,
            currentPoint.currentPoint.y - SVGViewBox / 2 + randY,
            randZ
          )
        )
      })
    })

    // creating an object that contains all the data to update movment... 
    lines.push({
      path: data.paths,
      length: paths.length,
      points: points,
      currentPos: 0,
      speed: 1
    })

    //creating intial position to the geo
    for (let i = 0; i < maxPoints; i++) {
      positions.set([Math.random(), Math.random(), 0], i * 3)
      opacity.set([Math.random() / 10], i)
    }

    //setting the arrays as geo attributes
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
  },

  // called when loading is in progresses
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },

  function (error) {
    console.log('An error happened');

  }
);
/////


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
    line.currentPos = line.currentPos % line.points.length // keeping them inset

    //showwing only 100 particles at a time
    for (let i = 0; i < 100; i++) {
      let index = (line.currentPos + i) % line.points.length
      let showPoint = line.points[index]
      //using additional index to loop over the path
      positions.set([showPoint.x, showPoint.y, showPoint.z], j * 3)
      opacity.set([i / 200], j)
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