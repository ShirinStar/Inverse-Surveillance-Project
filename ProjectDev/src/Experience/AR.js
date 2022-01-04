import * as THREE from 'three'
import gsap from 'gsap';
import Content from './World/Content.js';

export default class AR extends Content {
  constructor() {
    super()

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


    this.markerRoot.add(this.video.videoNoiseMesh)

    this.setArToolKitSource()
    this.createArToolKitContext()

    this.count = 0;
    this.scene.add(this.tatreez.SVGMesh)

    // this.animatePlayBtn()
    this.canvas.addEventListener('touchstart', this.onTouch.bind(this))
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
  }



  //aadd video with touch
  onTouch() {
    this.cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1),
      new THREE.MeshBasicMaterial()
    )
    this.count++

    if (this.count === 1) {
      this.scene.add(this.cube)
    }
    //make sure you add and remove btn correcly
    this.scene.remove(this.playMesh)
  }

  ///
  // animatePlayBtn() {
  //   gsap.to(this.tatreez.material.uniforms.uOpacity, {
  //     delay: 5,
  //     duration: 1,
  //     value: 0,
  //     onComplete: () => {
  //       //how to bind this
  //       this.tatreez.onDestroy()
  //       this.scene.remove(this.tatreez.SVGMesh)
  //       console.log('run?');
  //     }
  //   })
  //   gsap.to(this.playMesh.material, {
  //     delay: 8,
  //     duration: 4,
  //     opacity: 1,
  //     onComplete: () => {
  //       console.log('allow touch');
  //     }
  //   })
  // }

}