import * as THREE from 'three'
import vertexShader from '../shaders/tatreezVertex.glsl';
import fragmentShader from '../shaders/tatreezFragment.glsl';
import Experience from "../Experience.js";


export default class Tatreez {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.textureLoader = new THREE.TextureLoader()
    this.particleTexture = this.textureLoader.load('textures/particles.png')

    this.video = document.querySelector('.video')
    this.videoTexture = new THREE.VideoTexture(this.video)
    

    this.SVGMesh = null;
    this.geometry;
    this.material;
    this.positions;
    this.opacity;
    this.lines = [];
    this.SVGViewBox = 100;
  
    this.numberOfRenderedParticles = 100;
    this.changingOpacity = 400;
    this.changeRandomX = 0;
    this.changeRandomY = 0;
    this.changeRandomZ = 0;

    this.loadSVG()
    this.updateTrails()
  }

  loadSVG() {
    this.svg = [...document.querySelectorAll('.tatreez1')]

    this.svg.forEach((path, j) => {
      this.len = path.getTotalLength()
      this.numberOfPoints = Math.floor(this.len)

      this.points = []

      for (let i = 0; i < this.numberOfPoints; i++) {
        this.pointAt = this.len * i / this.numberOfPoints //this will change based on the length and total number of the path
        this.onePoint = path.getPointAtLength(this.pointAt)
       
        this.randX = (Math.random() - 0.5) * this.changeRandomX
        this.randY = (Math.random() - 0.5) * this.changeRandomY
        this.randZ = (Math.random() - 0.5) * this.changeRandomZ

        this.points.push(new THREE.Vector3(
          this.onePoint.x - this.SVGViewBox / 2 + this.randX,
          this.onePoint.y - this.SVGViewBox / 2 + this.randY,
          this.randZ))
      }

      this.lines.push({
        id: j,
        path: path,
        length: this.len,
        number: this.numberOfPoints,
        points: this.points,
        currentPos: 0,
        speed: 1
      })

      this.maxPoints = this.points.length * 200;

      this.positions = new Float32Array(this.maxPoints * 3)
      this.opacity = new Float32Array(this.maxPoints)

      // for(let i =0 ; i < this.maxPoints; i++) {
      //   this.opacity.set([Math.random()], i)
      //   this.positions.set([Math.random() * 100, Math.random() * 1000, 0], i * 3 )
      // }

      //uncomment this instead of the loop to draw the svg
      // this.lines.forEach(line => {
      //   line.points.forEach(singlePoint => {
      //     this.positions.push(singlePoint.x, singlePoint.y, singlePoint.z)
      //     this.opacity.push(Math.random())
      //   })
      // })
    })

    this.geometry = new THREE.BufferGeometry()
    // this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.positions), 3))
    // this.geometry.setAttribute('opacity', new THREE.BufferAttribute(new Float32Array(this.opacity), 1))

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('opacity', new THREE.BufferAttribute(this.opacity, 1));


    this.material = new THREE.ShaderMaterial({
     
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: { value: this.videoTexture },
        uAlphaMap: {value: this.particleTexture},
        uOpacity: { value: 1 }
      },
      transparent: true,
      // opacity: 1,
      depthTest: true,
      depthWrite: true,
      //blending: THREE.AdditiveBlending
    })

    this.SVGMesh = new THREE.Points(this.geometry, this.material)

    this.SVGMesh.rotation.z = Math.PI
    this.SVGMesh.scale.set(0.02, 0.02, 0.02)

    //this.scene.add(this.SVGMesh)
  }

  //animationg particles path
  updateTrails() {
    let j = 0;

     //accesing the object that was created with the svg load
    this.lines.forEach(line => {
      line.currentPos += line.speed
      line.currentPos = line.currentPos % line.number // keeping them inset ;

       //showing only 100 particles at a time
      for (let i = 0; i < this.numberOfRenderedParticles; i++) {
        this.index = (line.currentPos + i) % line.number// keeping it in the range of max points
        this.showPoint = line.points[this.index]
        //using additional index to loop over the path
        this.positions.set([this.showPoint.x, this.showPoint.y, this.showPoint.z], j * 3)
        this.opacity.set([i / this.changingOpacity], j)
        j++
      }
    })
    //updating
    if (this.SVGMesh !== null) {
      this.SVGMesh.geometry.attributes.position.array = this.positions
      this.SVGMesh.geometry.attributes.position.needsUpdate = true;
    }
  }

  onDestroy() {
    this.geometry.dispose()
    this.material.dispose()
    console.log('tatreez destroy');
  }

}

