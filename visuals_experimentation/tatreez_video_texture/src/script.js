import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import videoVertexShader from './shaders/videoVertex.glsl'
import videoFragmentShader from './shaders/videoFragment.glsl'
import tatreezVertexShader from './shaders/tatreezVertex.glsl'
import tatreezFragmentShader from './shaders/tatreezFragment.glsl'
import gsap from 'gsap';

let SVGMesh = null;
let videoMesh = null;
let videoGeometry = null;
let svgGeometry = null;
let svgMaterial = null;
let positions;
let opacity;
let lines = [];
const SVGViewBox = 512;
let renderVideo = {
  value: false,
};

const gui = new dat.GUI()

const canvas = document.querySelector('.webgl')

const scene = new THREE.Scene()

const video = document.querySelector('.video')
const videoTexture = new THREE.VideoTexture(video)

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


const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 10000)
camera.position.z = 600
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const videoMaterial = new THREE.ShaderMaterial({
  vertexShader: videoVertexShader,
  fragmentShader: videoFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uRange: { value: 0},
    uTexture: { value: videoTexture },
    uResolution: { value: new THREE.Vector4() },
    uOpacity: { value: 1 }, 
    uPointScale: {value: 0.5},
    uSVGorVideo: {value: false}
    
  },
})

// ///svg Tatreez///
const svg = [...document.querySelectorAll('.cls-1')]

svg.forEach((path, j) => {
  let len = path.getTotalLength()
  let numberOfPoints = Math.floor(len / 10)

  let points = []
  positions = []
  opacity = []

  for (let i = 0; i < numberOfPoints; i++) {
    let pointAt = len * i / numberOfPoints //this will change based on the length and total number of the path
    let onePoint = path.getPointAtLength(pointAt)
    let randX = (Math.random() - 0.5) * 2
    let randY = (Math.random() - 0.5) * 2
    let randZ = (Math.random() - 0.5) * 10

    points.push(new THREE.Vector3(onePoint.x - SVGViewBox / 2 + randX,
      onePoint.y - SVGViewBox / 2 + randY,
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

  // lines.forEach(line => {
  //   line.points.forEach(p => {
  //     positions.push(p.x, p.y, p.z)
  //     opacity.push(Math.random());
  //   })
  // })
  let maxPoints = points.length * 300;

  positions = new Float32Array(maxPoints * 3)
  opacity = new Float32Array(maxPoints)

})

const createShape = () => {
  if (videoMesh!==null) {
    videoGeometry.dispose()
    videoMaterial.dispose()
    scene.remove(videoMesh)
  }

  if (SVGMesh !==null) {
    svgGeometry.dispose()
    videoMaterial.dispose()
    scene.remove(SVGMesh)
  }


  if (videoMaterial.uniforms.uSVGorVideo.value) {
    video.currentTime = 0
    video.play()
    videoGeometry = new THREE.BoxBufferGeometry(1.1 * SVGViewBox, 1 * SVGViewBox, 0.1, 480/2, 360/2, 480/2);
    videoMesh = new THREE.Points(videoGeometry, videoMaterial)
    
    scene.add(videoMesh)
    
  } else {
    svgGeometry = new THREE.BufferGeometry()
    svgGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    svgGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacity, 1));

    // svgMaterial = new THREE.ShaderMaterial({
    //   vertexShader: tatreezVertexShader,
    //   fragmentShader: tatreezFragmentShader,
    //   uniforms: {
    //     uTexture: { value: videoTexture },
    //     uOpacity: { value: 1 },
    //   },
    //   transparent: true,
    //   depthWrite: true,
    //   depthTest: true,
    //   // blending: THREE.AdditiveBlending
    // })

    SVGMesh = new THREE.Points(svgGeometry, videoMaterial)
    scene.add(SVGMesh)
   
  }
}
createShape()
gui.add(videoMaterial.uniforms.uSVGorVideo, 'value').onFinishChange(createShape)

const destroySVG = () => {
  if (SVGMesh !== null) {
    svgGeometry.dispose()
    svgMaterial.dispose()
    scene.remove(SVGMesh)
  }
}

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//animationg SVG particles path
const updateTrails = () => {
  let j = 0;

  //accesing the object that was created with the svg load
  lines.forEach(line => {
    line.currentPos += line.speed
    line.currentPos = line.currentPos % line.number // keeping them inset

    //showing only 100 particles at a time
    for (let i = 0; i < 150; i++) {
      let index = (line.currentPos + i) % line.number
      let showPoint = line.points[index]
      //using additional index to loop over the path
      positions.set([showPoint.x, showPoint.y, showPoint.z], j * 3)
      opacity.set([i / 500], j)
      j++
    }
  })
  //updating
  if (SVGMesh) {
    SVGMesh.geometry.attributes.position.array = positions
    SVGMesh.geometry.attributes.position.needsUpdate = true;
  }
}


//video animation
// gsap.to(svgMaterial.uniforms.uOpacity, {
//   delay: 10,
//   duration: 20,
//   value: 0,
//   onComplete: destroySVG
// })
// gsap.to(renderVideo, {
//   delay: 9,
//   value: true,
//   ease: "power2.out",
//   onComplete: () => {
//     createShape(),
//       gsap.to(videoMaterial.uniforms.uOpacity, {
//         value: 1,
//         delay: 1,
//         duration: 30,
//       })
      // gsap.to(videoMaterial.uniforms.uPointScale, {
      //   value: 0.0,
      //   delay: 0,
      //   duration: 30,
      
      // })
    // }
  
//     // gsap.to(videoMaterial.uniforms.uRange, {
//     //   delay: 20,
//     //   duration: 20,
//     //   value: 0,
//     //   onComplete: () => {
//     //     video.currentTime = 0
//     //     video.play()
//     //   }
//     // })
  
// })


video.addEventListener('ended', () => {
  gsap.to(videoMaterial.uniforms.uRange, {
    delay: 0.2,
    duration: 120,
    value: 3
  })
})




const render = () => {
  renderer.render(scene, camera);
}

const clock = new THREE.Clock()

const animate = () => {
  controls.update()

  const elapsedTime = clock.getElapsedTime()

  if (videoMesh !== null) {
    videoMaterial.uniforms.uTime.value = elapsedTime
    videoMesh.geometry.parameters.needsUpdate = true
    videoGeometry.verticesNeedUpdate = true
    videoMesh.matrixWorldNeedsUpdate =true
  }
  updateTrails()
  requestAnimationFrame(animate);

  render();
}

animate()