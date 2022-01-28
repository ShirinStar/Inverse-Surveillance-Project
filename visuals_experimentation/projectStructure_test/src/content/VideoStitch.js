import * as THREE from 'three';
import vertexShader from './shader/vertexStitch.glsl';
import fragmentShader from './shader/fragmentStitch.glsl';
import gsap from 'gsap';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';

export default class VideoStitch {
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

    //this.setupAudio()
    this.soundControl()

    this.animateStitch()
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

  }

  setMesh() {
    this.videoStitchMesh = new THREE.Mesh(this.videoGeometry, this.videoStitchMaterial);
    this.videoStitchMesh.position.z = 0.5;
    // this.scene.add(this.videoStitchMesh)
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
    this.sound.setMaxDistance(1.8); // more settings here: https://threejs.org/docs/#api/en/audio/PositionalAudio
    this.sound.setLoop(true);
    // Good definitions for what each of these are at
    // https://stackoverflow.com/questions/36706118/use-three-js-positionalaudio-to-make-a-cone-of-sound
    // coneInnerAngle, coneOuterAngle, coneOuterGain (from 0-1, 0 means no audio outside of cone)
    this.sound.setDirectionalCone(230, 280, 0);

    const audioLoader = new THREE.AudioLoader();
    const buffer = await audioLoader.loadAsync(this.audio);
    this.sound.setBuffer(buffer);

    // optional helper to visualize the cone shape
    //const helper = new PositionalAudioHelper(this.sound);
    //this.sound.add(helper);
  }

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

  async soundControl() {
    if (!this.audioIsInitialized) {
      await this.setupAudio()
      this.audioIsInitialized = true
      this.startAudio()
      console.log("start audio")
    }
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
      delay: 5,
      duration: 10,
      value: 0.7,
    })
    gsap.to(this.videoStitchMaterial.uniforms.uWidthStripY, {
      delay: 10,
      duration: 10,
      value: 0.4,
    })
    gsap.to(this.videoStitchMaterial.uniforms.uWidthStripX, {
      delay: 25,
      duration: 5,
      value: 0.1,
    })
  }
}