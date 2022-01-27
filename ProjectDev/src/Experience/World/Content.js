import * as THREE from 'three'
import Experience from "../Experience.js"
import Tatreez from './Tatreez.js'
import VideoStitch from './VideoStitch.js'


export default class Content {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera
    this.renderer = this.experience.renderer

    this.videoOneClassName = '.video.one'
    this.audioOne = '../audio/alan_watts.mp3'

    this.videoTwoClassName = '.video.two'
    this.audioTwo = '../audio/nina_audio.mp3'

    //this.videoStich = new VideoStitch()
    //this.tatreez = new Tatreez()
 
  }
}