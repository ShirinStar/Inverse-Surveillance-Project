import * as THREE from 'three'
import Experience from "../Experience.js";
import Environment from './Environment.js';
import Video from './Video.js';

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
      //setup
      this.video = new Video()
      this.environment = new Environment()
    })
  }

  update() {
  
  }
}