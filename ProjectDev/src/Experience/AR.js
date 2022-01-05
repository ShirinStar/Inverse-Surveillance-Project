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

    this.markerRoot = new THREE.Group();
    this.scene.add(this.markerRoot);

    this.markerControls = new THREEx.ArMarkerControls(this.arToolkitContext, this.markerRoot, {
      type: 'pattern',
      patternUrl: "pattern-lightGreyThree.patt",
      //https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
      //make sure bg color is light grey 240 240 240
    })

    //this.markerRoot.add(this.tatreez.SVGMesh)   
    this.scene.add(this.tatreez.SVGMesh)

    this.setArToolKitSource()
    this.createArToolKitContext()
    this.animateTatreezTransition()
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
    // this.tatreez.SVGMesh.geometry.attributes.position.needsUpdate = true

    if(this.playVideo1) {
      this.scene.add(this.video.videoStitchMesh)
    }
  }

//if markeroot is visible
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
        this.scene.remove(this.tatreez.SVGMesh)
      }
    })
  }
}