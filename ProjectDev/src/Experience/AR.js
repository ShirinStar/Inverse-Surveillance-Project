import * as THREE from 'three'
import Experience from "./Experience.js";

export default class AR {
  constructor() {

    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera

    this.arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam',
      //phone
      // sourceWidth: this.sizes.height,
      // sourceHeight: this.sizes.width,

      displayWidth: this.sizes.width,
      displayHeight: this.sizes.height,
    });



    this.arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: 'camera_para.dat', //from https://github.com/jeromeetienne/AR.js/blob/master/data/data/camera_para.dat
      detectionMode: 'mono',
    })

    this.markerRoot = new THREE.Group();
    this.scene.add(this.markerRoot);

    this.markerControls = new THREEx.ArMarkerControls(this.arToolkitContext, this.markerRoot, {
      type: 'pattern',
      patternUrl: "pattern-marker.patt",
    })


    this.setArToolKitSource()
    this.createArToolKitContext()
    this.update()
    
  }

  setArToolKitSource() {
    // setup arToolkitSource
    this.arToolkitSource.init(() => {
      this.onResize()
    })
  }

  // create atToolkitContext
  createArToolKitContext() {
    this.arToolkitContext.init(() => {    
      this.camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix());
    })
  }

  // build markerControls
  onResize() {
    this.arToolkitSource.onResize()
    this.arToolkitSource.copySizeTo(this.canvas)
    if (this.arToolkitContext.arController !== null) {
      this.arToolkitSource.copySizeTo(this.arToolkitContext.arController.canvas)
    }
  }

  update() {
      // update artoolkit on every frame
      console.log(this.arToolkitSource.ready);
      if (this.arToolkitSource.ready !== false) {
        this.arToolkitContext.update(this.arToolkitSource.domElement)
    }
  }
}