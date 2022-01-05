import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from "./Experience.js";

export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setOrbitConrtols()
    this.resize()
    this.update()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(70, this.sizes.width * 2 / this.sizes.height, 0.1, 1000)
    this.instance.position.z = 3
    this.scene.add(this.instance)
  }

  setOrbitConrtols() {
    this.controls = new OrbitControls(this.instance, this.canvas) 
    this.controls.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }
}