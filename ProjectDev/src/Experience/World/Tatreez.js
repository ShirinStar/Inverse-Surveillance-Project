import * as THREE from 'three'
import vertexShader from '../shaders/tatreezVertex.glsl';
import fragmentShader from '../shaders/tatreezFragment.glsl';
import Experience from "../Experience.js";
import gsap from 'gsap';

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
    //this is for SVG 100x100
    this.SVGViewBox = 100;
  
    this.numberOfRenderedParticles = 100;
    this.changingOpacity = 400;

    this.loadSVG()
    this.updateTrails()

    this.animateTatreezTransition()
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
       
        this.randX = (Math.random() - 0.5) 
        this.randY = (Math.random() - 0.5)
        this.randZ = (Math.random() - 0.5) 

        this.points.push(new THREE.Vector3(
          this.onePoint.x - this.SVGViewBox / 2,
          this.onePoint.y - this.SVGViewBox / 2,
          0))
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

      //how many points
      this.maxPoints = this.points.length * 250;

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
        uAlphaMap: { value: this.particleTexture },
        uOpacity: { value: 1 },
        uPointSize: { value: 15.0},
        uRangePointsRandom: { value: 0.0 }
      },
      transparent: true,
      // opacity: 1,
      depthTest: true,
      depthWrite: true,
      //blending: THREE.AdditiveBlending
    })

    this.SVGMesh = new THREE.Points(this.geometry, this.material)

    this.SVGMesh.rotation.z = Math.PI
    this.SVGMesh.rotation.x = -Math.PI / 4
    this.SVGMesh.scale.set(0.01, 0.02, 0.02)

    //this.scene.add(this.SVGMesh)
  }

  //animating particles path
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

  animateTatreezTransition() {
    gsap.to(this, {
      delay: 15,
      duration: 20, 
      numberOfRenderedParticles: 350,
    })
    gsap.to(this.material.uniforms.uPointSize, {
      delay: 10,
      duration: 5, 
      value: 6.0,
    })
    gsap.to(this.material.uniforms.uRangePointsRandom, {
      delay: 10,
      duration: 2, 
      value: 1,
    })
    gsap.to(this.material.uniforms.uRangePointsRandom, {
      delay: 10,
      duration: 15, 
      value: (Math.random() - 0.5) * 50,
    })
    gsap.to(this.material.uniforms.uPointSize, {
      delay: 15,
      duration: 6, 
      value: 1.0,
      onComplete: () => {
        this.onDestroy()
      }
    })
  }
}

