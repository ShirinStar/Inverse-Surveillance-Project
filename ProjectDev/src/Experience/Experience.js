import * as THREE from 'three'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Size from "./Utils/Size.js"
import Time from "./Utils/Time.js"
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'
import Debug from './Utils/Debug.js'

let instance = null

export default class Experience {
  constructor(canvas) {

    //checking if the scene was instantiated already
    if (instance) {
      return instance
    }

    instance = this

    //global scope
    window.experience = this

    this.canvas = canvas

    //setup
    this.debug = new Debug()
    this.sizes = new Size()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    //resize event
    this.sizes.on('resize', () => {
      this.resize()
    })

    //animation
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      this.world.ar.video.videoStitchMaterial.uniforms.uTime.value = elapsedTime * 0.5

      requestAnimationFrame(animate);
      this.update();
    }
    animate()
  }


  resize() {
    this.camera.resize()
    //the world holds the onResize of the arjs
    this.world.resize()
    this.renderer.resize()
  }


  update() {
    this.camera.update()
    //the world is updating the ar -> ar updates the content
    this.world.update()
    this.renderer.update()
  }

  // destroy() {
  //   this.sizes.off('resize')
  //   this.time.off('tick')
  // }

}