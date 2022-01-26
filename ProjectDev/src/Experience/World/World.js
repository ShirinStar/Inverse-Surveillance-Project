import * as THREE from 'three'
import Experience from "../Experience.js";
import Webxr from '../WebXR.js'
import ARjs from '../AR.js';



export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
  
    this.webxr = new Webxr()
    //this.arjs = new ARjs()


    //test mesh
    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({color: 'red'})
    )
    
    testMesh.position.set(0, 0, -5)
    this.scene.add(testMesh)
    
  }

  update() {
    //this.arjs.update()
    // this.tatreez.updateTrails()
  }

  resize() {
   //this.arjs.onResize()
  }
}