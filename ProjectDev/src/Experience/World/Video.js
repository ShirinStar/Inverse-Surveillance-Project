import * as THREE from 'three'
import vertexShader from '../shader/vertexPoint.glsl';
import fragmentShader from '../shader/fragment.glsl';
import Experience from "../Experience.js";
import AR from '../AR.js'

const video = document.querySelector('.video')
const videoTexture = new THREE.VideoTexture(video)

export default class VideoMesh extends AR{
  constructor() {
    super()
 
    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }
  
  setGeometry() {
    this.geometry = new THREE.BoxGeometry(1.1 *3, 1 *3, 0.1, 480/2, 360/2, 480/2);
  }


  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRange: { value: 0 },
        uTexture: { value: videoTexture },
        uResolution: { value: new THREE.Vector4() }
      }
    })
  }

  setMesh() {
    this.mesh = new THREE.Points(this.geometry, this.material);
    // this.mesh.position.y = 0.5;
    // this.mesh.rotation.x = -90;
    this.markerRoot.add(this.mesh)
    // this.scene.add(this.mesh)
  }
}