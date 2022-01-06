import * as THREE from 'three'
import AR from '../AR.js';
import Experience from "../Experience.js";


export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
   
    this.ar = new AR()

    // const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial()
    // )

    // this.scene.add(testMesh)
    
  }

  update() {
   this.ar.update()
    // this.tatreez.updateTrails()
  }

  resize() {
   this.ar.onResize()
  }
}