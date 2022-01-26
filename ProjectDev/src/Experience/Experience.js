import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import World from './World/World.js'
import Debug from './Utils/Debug.js'

let instance = null

export default class Experience {
  constructor(canvas) {

    //checking if the scene was instantiated already
    if (instance) {
      return instance
    }

    instance = this

    //access in global scope
    window.experience = this

    //setup
    this.debug = new Debug()

    this.canvas = canvas
    this.scene = new THREE.Scene()

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.camera = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.01, 1000)
    this.camera.position.z = 3
    this.scene.add(this.camera)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.xr.enabled = true //init webxr api

    const button = ARButton.createButton(this.renderer, {
      optionalFeatures: ["dom-overlay", "dom-overlay-for-handheld-ar"],
      domOverlay: {
        root: document.body
      }
    });
    document.body.appendChild(button)
    button.style.backgroundColor = 'black'

    button.addEventListener('click', () => {
      console.log('enter AR')
    })

    window.addEventListener('resize', () => {
      this.world.resize()
      this.sizes.width = window.innerWidth
      this.sizes.height = window.innerHeigh
      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    //content
    this.world = new World()
    console.log(this.world);

    //animation
    this.clock = new THREE.Clock()

    this.animate()
  }


  animate() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render(timestamp, frame) {
    const elapsedTime = this.clock.getElapsedTime()

    this.world.webxr.videoNoiseOne.videoNoiseMaterial.uniforms.uTime.value = elapsedTime
  
    this.world.update()

    this.renderer.render(this.scene, this.camera)
  }
}