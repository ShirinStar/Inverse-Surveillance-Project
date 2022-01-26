import * as THREE from 'three'
import Content from './World/Content.js';
import gsap from 'gsap';

export default class WebXR extends Content {
  constructor() {
    super()

    this.videoCount = 0

    this.controller = this.renderer.xr.getController(0);
    this.controller.addEventListener('select', this.onSelect.bind(this));
    this.scene.add(this.controller)

    this.videoOne = document.querySelector('.video.one')
    this.videoTwo = document.querySelector('.video.two')
  }

  onSelect() {

    //this.soundControl()

    //adding video to the scene in the position of the 'tap' and based on order
    if (this.videoCount === 0) {
      this.videoOne.play()

      const mesh = new THREE.Points(this.videoNoiseOne.videoGeometry, this.videoNoiseOne.videoNoiseMaterial)
      mesh.scale.multiplyScalar(0.3)
      mesh.position.set(0, 0, - 0.3).applyMatrix4(this.controller.matrixWorld);
      mesh.quaternion.setFromRotationMatrix(this.controller.matrixWorld);
      this.scene.add(mesh);
      mesh.add(this.videoNoiseOne.sound)
      this.soundControl()
      this.videoCount++
    }

    else if (this.videoCount === 1) {
      this.videoTwo.play()

      const mesh = new THREE.Points(this.videoNoiseTwo.videoGeometry, this.videoNoiseTwo.videoNoiseMaterial)
      mesh.scale.multiplyScalar(0.2)
      mesh.position.set(0, 0, - 0.5).applyMatrix4(this.controller.matrixWorld);
      mesh.quaternion.setFromRotationMatrix(this.controller.matrixWorld);
      this.scene.add(mesh);

      this.videoCount++
    }
  }

  async soundControl() {
    if (!this.videoNoiseOne.audioIsInitialized) {
      await this.videoNoiseOne.setupAudio()
      this.videoNoiseOne.audioIsInitialized = true
      this.videoNoiseOne.startAudio()
      console.log("start audio")
    }
  }

  soundOff() {
    this.videoNoiseOne.stopAudio()
  }
}