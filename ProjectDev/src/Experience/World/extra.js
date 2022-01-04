  //temp play icon- might be best to move to another class
  function toPlay() {
    this.playGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
       0,  0, 1,
      -.5,  .5, 1,
      -.5, -.5, 1
    ] );
    this.playGeo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    this.playMat = new THREE.MeshBasicMaterial( { 
      color: 0xff0000,
      transparent: true,
      opacity: 0
    } )
    this.playMesh = new THREE.Mesh(this.playGeo, this.playMat);
    this.playMesh.scale.set(0.5, 0.5, 0.5)
    this.playMesh.position.x = 0
    this.scene.add(this.playMesh);
  }