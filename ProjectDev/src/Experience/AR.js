import * as THREE from 'three'
import gsap from 'gsap';
import Content from './World/Content.js';

export default class AR extends Content {
  constructor() {
    super()

    this.count = 0;
    this.playVideo1 = false;

    this.arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam',

      sourceWidth: window.innerHeight,
      sourceHeight: window.innerWidth,

      displayWidth: window.innerWidth,
      displayHeight: window.innerHeight,
    });

    this.arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: 'camera_para.dat', //from https://github.com/jeromeetienne/AR.js/blob/master/data/data/camera_para.dat
      detectionMode: 'mono',
    })

    //defining markers
    this.markerOne = new THREE.Group();
    this.scene.add(this.markerOne);

    this.markerControls = new THREEx.ArMarkerControls(this.arToolkitContext, this.markerOne, {
      type: 'pattern',
      patternUrl: "tatreez/pattern-threeLines.patt",
      //https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
      //make sure bg color is light grey 240 240 240
    })

    this.markerOne.add(this.tatreez.SVGMesh)   
    //this.scene.add(this.tatreez.SVGMesh)

    this.setArToolKitSource()
    this.createArToolKitContext()
  
  }

  // setup arToolkitSource
  setArToolKitSource() {
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
    if (this.arToolkitSource.ready !== false) {
      this.arToolkitContext.update(this.arToolkitSource.domElement)
    }
    this.tatreez.updateTrails()

    if(this.markerOne.visible && !this.playVideo1) {
      this.animateTatreezTransition()
    }

    if(this.playVideo1) {
      this.scene.add(this.video.videoStitchMesh)
    }
  }

  animateTatreezTransition() {
  
    //7. check with ar and markers. does the video stays in that position?
   
    gsap.to(this, {
      delay: 12,
      playVideo1: true,
      onComplete: () => {
        this.video.animateStitch()
      }
    })
    gsap.to(this, {
      delay: 40,
      onComplete: () => {
        //remove from marker root
        this.scene.remove(this.tatreez.SVGMesh)
      }
    })
  }
}