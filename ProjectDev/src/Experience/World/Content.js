import * as THREE from 'three'
import Experience from "../Experience.js";
import Tatreez from './Tatreez.js';
import Video from './Video.js'

export default class Content {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera

    this.video = new Video()

    this.tatreez = new Tatreez()
 
  }
}