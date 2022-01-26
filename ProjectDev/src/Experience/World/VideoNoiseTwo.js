import * as THREE from 'three';
import Experience from "../Experience.js";
import vertexShader from '../shaders/vertexVideoNoise.glsl';
import fragmentShader from '../shaders/fragmentVideoNoise.glsl';
import gsap from 'gsap';
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';


export default class VideoNoiseTwo {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera
    this.debug = this.experience.debug

    this.listener;
    this.sound;

    this.url = '../audio/nina_audio.mp3';

    this.audioIsInitialized = false
    this.audioIsPlaying = false

    this.video = document.querySelector('.video.two')
    this.videoTexture = new THREE.VideoTexture(this.video)

    //debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('noise video2')
    }

    this.setGeometry()
    this.setMaterial()

    //this.setupAudio()

    this.animate()
  }

  setGeometry() {
    this.videoGeometry = new THREE.BoxGeometry(1.3, 1, 0.1, 480 / 2, 360 / 2, 480 / 2)
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
    const buffer = await audioLoader.loadAsync(this.url);
    this.sound.setBuffer(buffer);

    // optional helper to visualize the cone shape
    const helper = new PositionalAudioHelper(this.sound);
    this.sound.add(helper);
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

  startAudio() {
    this.sound.play()
    console.log(this.sound)
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

}