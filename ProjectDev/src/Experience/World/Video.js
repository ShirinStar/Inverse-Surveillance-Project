import * as THREE from 'three'
import vertexShader from '../shader/vertexPoint.glsl';
import fragmentShader from '../shader/fragment.glsl';
import Experience from "../Experience.js";


const video = document.querySelector('.video')
const videoTexture = new THREE.VideoTexture(video)

export default class VideoNoise {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera
    this.debug = this.experience.debug

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('noise video')
    }

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.videoGeometry = new THREE.BoxGeometry(1.1 * 3, 1 * 3, 0.1, 480 / 2, 360 / 2, 480 / 2);
  }


  setMaterial() {
    this.videoNoiseMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRange: { value: 0 },
        uTexture: { value: videoTexture },
        uResolution: { value: new THREE.Vector4() }
      }
    })

    if (this.debug.active) {
      this.debugFolder.add(this.videoNoiseMaterial.uniforms.uRange, 'value')
        .min(0)
        .max(4)
        .step(0.001)
        .name('Noise Range')
    }
  }

  setMesh() {
    this.videoNoiseMesh = new THREE.Points(this.videoGeometry, this.videoNoiseMaterial);
    this.videoNoiseMesh.position.y = 0.5;
    this.videoNoiseMesh.rotation.x = -90;
    // this.scene.add(this.videoNoiseMesh)
  }
}