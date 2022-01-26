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

  }
  onSelect() {

    //adding video to the scene in the position of the 'tap' and based on order
    if (this.videoCount === 0) {
      this.videoOne.play()

      const mesh = new THREE.Points(this.videoNoiseOne.videoGeometry, this.videoNoiseOne.videoNoiseMaterial)
      mesh.scale.multiplyScalar(0.3)
      // mesh.position.z = -.5

      mesh.position.set(0, 0, - 0.3).applyMatrix4(this.controller.matrixWorld);
      mesh.quaternion.setFromRotationMatrix(this.controller.matrixWorld);

      this.scene.add(mesh);

      this.videoCount++
    }
    if (this.videoCount === 1) {
      // this.videoOne.play()

      // const mesh = new THREE.Points(this.videoNoiseOne.videoGeometry, this.videoNoiseOne.videoNoiseMaterial)
      // mesh.scale.multiplyScalar(0.3)
      // // mesh.position.z = -.5

      // mesh.position.set(0, 0, - 0.3).applyMatrix4(this.controller.matrixWorld);
      // mesh.quaternion.setFromRotationMatrix(this.controller.matrixWorld);

      // this.scene.add(mesh);

      this.videoCount++
    }
  }

}