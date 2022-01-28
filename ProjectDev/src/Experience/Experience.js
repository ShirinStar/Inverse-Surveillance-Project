import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import Debug from './Utils/Debug.js'
import WebXR from './WebXR.js';

let instance = null

export default class Experience {
  constructor(canvas) {

    //checking if the scene was instantiated already
    if (instance) {
      return instance
    }
    
    instance = this

    //access in global scope
   // window.experience = this

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
    button.style.backgroundColor = '#155C4D'

    const titles = document.querySelector('.enteringTitles')

    button.addEventListener('click', async () => {
      console.log('enter AR')
      
      titles.style.display = 'none'
      
      //turn off sound when click again on stop AR
      this.webxr.soundOff()
    })

    window.addEventListener('resize', () => {
      this.sizes.width = window.innerWidth
      this.sizes.height = window.innerHeigh
      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    //content
    this.webxr = new WebXR()

    //animation
    this.clock = new THREE.Clock()

    this.animate()
  }

  animate() {
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render(timestamp, frame) {
    const elapsedTime = this.clock.getElapsedTime()
   
    if (this.webxr.videoOne !== undefined) {
      this.webxr.videoOne.videoNoiseMaterial.uniforms.uTime.value = elapsedTime
    }

    if (this.webxr.videoTwo !== undefined) {
      this.webxr.videoTwo.videoNoiseMaterial.uniforms.uTime.value = elapsedTime
    }

    if (this.webxr.videoThree !== undefined) {
      this.webxr.videoThree.videoStitchMaterial.uniforms.uTime.value = elapsedTime * 0.2
    }

    this.renderer.render(this.scene, this.camera)
  }
}