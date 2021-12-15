import * as THREE from 'three'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Size from "./Utils/Size.js"
import Time from "./Utils/Time.js"
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'
import Debug from './Utils/Debug.js'
import AR from './AR.js'

let instance = null

export default class Experience {
  constructor(canvas) {

    //checking if the scene was instantiated already
    if(instance) {
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
    //this.ar = new AR()


    //resize event
    this.sizes.on('resize', () => {
      this.resize()
    })

    //time tick event
    this.time.on('tick', () => {
      this.update()
    })
  }

  resize() {
    this.camera.resize()
    this.ar.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  destroy() {
    this.sizes.off('resize')
    this.time.off('tick')
  }

}