import * as THREE from 'three'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import World from './World/World.js'
import Debug from './Utils/Debug.js'

let instance = null

export default class Experience {
  constructor(canvas) {

    //checking if the scene was instantiated already
    if (instance) {
      return instance
    }

    instance = this

    //global scope
    window.experience = this

    this.canvas = canvas

    //setup
    this.debug = new Debug()

    this.scene = new THREE.Scene()
  
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.camera = new THREE.PerspectiveCamera(70, this.sizes.width * 2 / this.sizes.height, 0.01, 1000)
    this.camera.position.z = 3
    this.scene.add(this.camera)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.xr.enabled = true;

    window.addEventListener('resize', () => {
      //the world takes care of the AR.js resize
      this.world.resize()

      this.sizes.width = window.innerWidth
      this.sizes.height = window.innerHeight

      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    document.body.appendChild(ARButton.createButton(this.renderer));
    //this.renderer.domElement.style.display = "none";
    // //webxr api
    this.controller = this.renderer.xr.getController(0);
    this.controller.addEventListener('select', this.onSelect.bind(this));
    this.scene.add(this.controller);

    this.geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(Math.PI / 2);

    this.world = new World()

    //animation
    const clock = new THREE.Clock()

    const animateTime = () => {
      const elapsedTime = clock.getElapsedTime()
      //this.world.ar.video.videoStitchMaterial.uniforms.uTime.value = elapsedTime * 0.75
      window.requestAnimationFrame(animateTime);
      // this.update()
    }
    animateTime()
    this.animate()
  }


  animate() {
    this.renderer.setAnimationLoop(this.update.bind(this));
  }

  update() {
    this.renderer.render(this.scene, this.camera);
    //the world is updating the ar -> ar updates the content
    this.world.update()
  }


  onSelect() {
    console.log('click');
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, - 0.3).applyMatrix4(this.controller.matrixWorld);
    this.mesh.quaternion.setFromRotationMatrix(this.controller.matrixWorld);
    this.scene.add(this.mesh);
    // if(this.playVideo1) {
    // this.video.animateStitch()
    // this.video.videoStitchMesh.position.set( 0, 0, - 0.3 ).applyMatrix4(this.controller.matrixWorld);
    // this.video.videoStitchMesh.quaternion.setFromRotationMatrix(this.controller.matrixWorld);
    // this.scene.add(this.video.videoStitchMesh)
    // }
  }

}