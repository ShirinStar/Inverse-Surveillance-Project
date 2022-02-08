import * as THREE from 'three';
import vertexShader from './shader/vertexVideoNoise.glsl';
import fragmentShader from './shader/fragmentVideoNoise.glsl';
import gsap from 'gsap';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';

export default class VideoNoise {
  constructor(camera, videoClassName, audioLink) {
    this.camera = camera

    this.videoClass = videoClassName
    this.audio = audioLink

    this.listener;
    this.sound;

    this.audioIsInitialized = false
    this.audioIsPlaying = false

    this.video = document.querySelector(this.videoClass)
    this.video.play()
    this.videoTexture = new THREE.VideoTexture(this.video)

    this.setGeometry()
    this.setMaterial()
    this.setMesh()

    // this.setupAudio()
    this.soundControl()

    this.fadeIn()
    //this.animateEnding()
  }

  setGeometry() {
    this.videoGeometry = new THREE.BoxGeometry(1.3, 1, 1, 480 / 2, 360 / 2, 480 / 2)
  }

  setMaterial() {
    this.videoNoiseMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPointSize: { value: .01 },
        uRange: { value: 1.5 },
        uTexture: { value: this.videoTexture },
        uResolution: { value: new THREE.Vector4() }
      }
    })
  }

  setMesh() {
    this.videoNoiseMesh = new THREE.Points(this.videoGeometry, this.videoNoiseMaterial)
    //this.videoNoiseMesh.scale.multiplyScalar(0.3)
    // this.videoNoiseMesh.position.z = -.5
    // this.videoNoiseMesh.position.y = 1
    // this.scene.add(this.videoNoiseMesh)
  }

  //audio setup
  async setupAudio() {
    this.listener = new THREE.AudioListener()
    this.camera.add(this.listener);

    // this.setMesh()
    await this.createPositionalAudio();
  }

  async createPositionalAudio() {
    this.sound = new THREE.PositionalAudio(this.listener);
    this.sound.setRefDistance(0.1); // the distance between sound and listener at which the volume reduction starts taking effect.
    this.sound.setDistanceModel('linear'); // this has to be linear for the max distance to work
    this.sound.setMaxDistance(2); // more settings here: https://threejs.org/docs/#api/en/audio/PositionalAudio
    this.sound.setLoop(true);
    // Good definitions for what each of these are at
    // https://stackoverflow.com/questions/36706118/use-three-js-positionalaudio-to-make-a-cone-of-sound
    // coneInnerAngle, coneOuterAngle, coneOuterGain (from 0-1, 0 means no audio outside of cone)
    this.sound.setDirectionalCone(360, 360, 0);

    const audioLoader = new THREE.AudioLoader();
    const buffer = await audioLoader.loadAsync(this.audio);
    this.sound.setBuffer(buffer);

    // optional helper to visualize the cone shape
    const helper = new PositionalAudioHelper(this.sound);
    this.sound.add(helper);
  }

  //start animate shader
  fadeIn() {
    gsap.to(this.videoNoiseMaterial.uniforms.uRange, {
      duration: 5,
      value: 0,
      onComplete: () => {
        this.video.play()
      }
    })
    gsap.to(this.videoNoiseMaterial.uniforms.uPointSize, {
      delay: 2,
      duration: 10,
      value: 8.0
    })
  }

  // animateEnding() {
  //   this.video.addEventListener('ended', () => {
  //     gsap.to(this.videoNoiseMaterial.uniforms.uRange, {
  //       delay: 0.2,
  //       duration: 30,
  //       value: 4
  //     })
  //     gsap.to(this.videoNoiseMaterial.uniforms.uPointSize, {
  //       delay: 1,
  //       duration: 30,
  //       value: 5.0
  //     })
  //     gsap.to(this.videoNoiseMaterial.uniforms.uPointSize, {
  //       delay: 31,
  //       duration: 30,
  //       value: 2.0
  //     })
  //     gsap.to(this.videoNoiseMaterial.uniforms.uRange, {
  //       delay: 40,
  //       duration: 90,
  //       value: 10
  //     })
  //   })
  // }

  //control audio
  startAudio() {
    this.sound.play()
    this.audioIsPlaying = true
  }

  stopAudio() {
    if (this.audioIsInitialized) {
      this.sound.stop()
      this.audioIsPlaying = false;
    }
  }

  toggleAudio() {
    if (this.audioIsInitialized) {
      if (!this.audioIsPlaying) {
        this.startAudio()
      } else {
        this.stopAudio()
      }
    }
  }

  async soundControl() {
    if (!this.audioIsInitialized) {
      await this.setupAudio()
      this.audioIsInitialized = true
      this.startAudio()
      console.log("start audio")
    }
  }

}