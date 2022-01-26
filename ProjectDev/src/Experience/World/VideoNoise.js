import * as THREE from 'three';
import Experience from "../Experience.js";
import vertexShader from '../shaders/vertexVideoNoise.glsl';
import fragmentShader from '../shaders/fragmentVideoNoise.glsl';
import gsap from 'gsap';

export default class VideoNoise {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera
    this.debug = this.experience.debug

    this.video = document.querySelector('.video.one')
    this.videoTexture = new THREE.VideoTexture(this.video)

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('noise video')
    }

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.animate()
  }

  setGeometry() {
    this.videoGeometry = new THREE.BoxGeometry(1.3, 1 , 0.1, 480 / 2, 360 / 2, 480 / 2)
  }

  setMaterial() {
    this.videoNoiseMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRange: { value: 0 },
        uTexture: { value: this.videoTexture },
        uResolution: { value: new THREE.Vector4() }
      }
    })

    if (this.debug.active) {
      this.debugFolder.add(this.videoNoiseMaterial.uniforms.uRange, 'value')
        .min(0)
        .max(10)
        .step(0.1)
        .name('noise range')
    }
  }

  setMesh() {
    this.videoNoiseMesh = new THREE.Points(this.videoGeometry, this.videoNoiseMaterial)
    this.videoNoiseMesh.scale.multiplyScalar(0.3)   
    this.videoNoiseMesh.position.z = -.5
   
   // this.scene.add(this.videoNoiseMesh)
  }

  animate() {
    this.video.addEventListener('ended', () => {
      gsap.to(this.videoNoiseMaterial.uniforms.uRange, {
        delay: 0.2,
        duration: 30,
        value: 4
      })
    })
  }
}