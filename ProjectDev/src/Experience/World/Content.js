import * as THREE from 'three'
import Experience from "../Experience.js"
import Tatreez from './Tatreez.js'
import VideoStitch from './VideoStitch.js'
import VideoNoiseOne from './VideoNoiseOne.js'
import VideoNoiseTwo from './VideoNoiseTwo.js'

export default class Content {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera
    this.renderer = this.experience.renderer

    this.videoStich = new VideoStitch()
    this.videoNoiseOne = new VideoNoiseOne()
    this.videoNoiseTwo = new VideoNoiseTwo()

    //this.tatreez = new Tatreez()
 
  }
}