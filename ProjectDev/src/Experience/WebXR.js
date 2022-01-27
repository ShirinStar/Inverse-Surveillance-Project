import * as THREE from 'three'
import Content from './World/Content.js';
import gsap from 'gsap';
import VideoNoise from './World/VideoNoise.js';

export default class WebXR extends Content {
  constructor() {
    super()

    this.videoCount = 0

    this.controller = this.renderer.xr.getController(0);
    this.controller.addEventListener('select', this.onSelect.bind(this));
    this.scene.add(this.controller)

    this.videoOne;
    this.videoTwo;

  }

  onSelect() {
    //adding video to the scene in the position of the 'tap' and based on order

    if (this.videoCount === 0) {
      this.videoOne = new VideoNoise(this.videoOneClassName, this.audioOne)

      const mesh = this.videoOne.videoNoiseMesh
      mesh.scale.multiplyScalar(0.4)
      mesh.position.set(0, 0, - 0.2).applyMatrix4(this.controller.matrixWorld);
      mesh.quaternion.setFromRotationMatrix(this.controller.matrixWorld);
      this.scene.add(mesh);

      this.videoOne.video.play()
      mesh.add(this.videoOne.sound)
      this.videoCount++
    }

    else if (this.videoCount === 1) {
      this.videoTwo = new VideoNoise(this.videoTwoClassName, this.audioTwo)

      const mesh = this.videoTwo.videoNoiseMesh  
      mesh.scale.multiplyScalar(0.4)
      mesh.position.set(0, 0, - 0.2).applyMatrix4(this.controller.matrixWorld);
      mesh.quaternion.setFromRotationMatrix(this.controller.matrixWorld);
      this.scene.add(mesh);

      this.videoTwo.video.play()
      mesh.add(this.videoTwo.sound)
      this.videoCount++
    }
  }


  soundOff() {
    if (this.videoOne) {
      if (this.videoOne.audioIsInitialized) {
        this.videoOne.sound.stop()
        this.videoOne.audioIsPlaying = false;
      }
    }
    if (this.videoTwo) {
      if (this.videoTwo.audioIsInitialized) {
        this.videoTwo.sound.stop()
        this.videoTwo.audioIsPlaying = false;
      }
    }
  }

}