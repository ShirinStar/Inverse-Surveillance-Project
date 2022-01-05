import * as THREE from 'three'
import vertexShader from '../shaders/vertexStitch.glsl';
import fragmentShader from '../shaders/fragmentStitch.glsl';
import Experience from "../Experience.js";
import gsap from 'gsap';

export default class VideoStitch {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera
    this.debug = this.experience.debug

    this.video = document.querySelector('.video')
    this.videoTexture = new THREE.VideoTexture(this.video)

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('stitch video')
    }

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
   
  }

  setGeometry() {
    this.videoGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  }

  setMaterial() {
    this.videoStitchMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: this.videoTexture },
        uLengthStripX: { value: 0.99 },
        uLengthStripY: { value: 0.99 },
        uWidthStripX: { value: 0.99 },
        uWidthStripY: { value: 0.99 },
        uNumberOfStrips: { value: 25 },
      }
    })

    if (this.debug.active) {
      this.debugFolder.add(this.videoStitchMaterial.uniforms.uLengthStripX, 'value')
        .min(0)
        .max(1)
        .step(0.001)
        .name('lengthStrip x')
    }
  }

  setMesh() {
    this.videoStitchMesh = new THREE.Mesh(this.videoGeometry, this.videoStitchMaterial);
    this.videoStitchMesh.position.z = 0.5;
    // this.scene.add(this.videoStitchMesh)
  }

  animateStitch() {
    gsap.to(this.videoStitchMaterial.uniforms.uLengthStripX, {
      duration: 5,
      value: 0.01,
    })
    gsap.to(this.videoStitchMaterial.uniforms.uLengthStripY, {
      delay: 5,
      duration: 3,
      value: 0.01,
      onComplete: () => {
        this.video.play()
      }
    })
    gsap.to(this.videoStitchMaterial.uniforms.uWidthStripX, {
      delay: 8,
      duration: 15,
      value: 0.7,
    })
    gsap.to(this.videoStitchMaterial.uniforms.uWidthStripY, {
      delay: 15,
      duration: 20,
      value: 0.4,
    })
    gsap.to(this.videoStitchMaterial.uniforms.uWidthStripX, {
      delay: 30,
      duration: 10,
      value: 0.1,
    })
  }
}