import * as THREE from 'three'
import Content from './World/Content.js';
import gsap from 'gsap';

export default class WebXR extends Content {
  constructor() {
    super()

    this.controller = this.renderer.xr.getController(0);
    this.controller.addEventListener('select', this.onSelect.bind(this));
    this.scene.add(this.controller)

  }
   onSelect() {
    const geometry = new THREE.ConeGeometry( 0.1, 0.2, 32 ).rotateX(Math.PI / 2);;
    const material = new THREE.MeshBasicMaterial({
      color      :  0xffffff * Math.random(),
      transparent: 1,
      opacity    : 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( this.controller.matrixWorld );
    mesh.quaternion.setFromRotationMatrix( this.controller.matrixWorld );
    
    this.scene.add(mesh);
  }

}