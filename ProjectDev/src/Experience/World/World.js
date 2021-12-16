import * as THREE from 'three'
import AR from '../AR.js';
import Experience from "../Experience.js";
import Environment from './Environment.js';
import Content from './Content.js';

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial()
    // )

    // this.scene.add(testMesh)
    
 
    this.resources.on('ready', () => {
      //the ar is holding the scene content ->
      //it is an extend to the Content and then using markerRoor is adding the content
      this.ar = new AR()
      this.environment = new Environment()
      
    })
  }

  update() {
    this.ar.update()
  }

  resize() {
   this.ar.onResize()
  }
}