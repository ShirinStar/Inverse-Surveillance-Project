import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import Experience from "../Experience.js";


let SVGMesh;
let geometry;
let material;
let positions;
let opacity;
let lines = [];
const SVGViewBox = 512;

export default class Tatreez {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.loader = new SVGLoader();
    this.ready = false
    //   const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial()
    // )

    // this.scene.add(testMesh)

    this.loadSVG()

  }

  loadSVG() {
    this.loader.load(
      // resource URL
      'tatreez/threeShapeSecond.svg',
      // called when the resource is loaded
      function ( data ) {
        
        const paths = data.paths;

        console.log(paths);
        
        let points = []

        let maxPoints = paths.length * 100;
         positions = []
         opacity = new Float32Array(maxPoints)
    
        //accessing the x,y of tthe path and pushing them to the array
        paths.forEach(line => {
          line.subPaths.forEach(currentPoint => {
            points.push(
              new THREE.Vector3(
                currentPoint.currentPoint.x,
                currentPoint.currentPoint.y,
                0
              )
            )
          })
        })

        points.forEach(point => {
          positions.push(point.x, point.y, point.z)
        })

        geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', 
        new THREE.BufferAttribute(new Float32Array(positions), 3))

        material = new THREE.MeshBasicMaterial()

        SVGMesh = new THREE.Mesh(geometry, material)

        // can't load the mesh to the scene -> open new project and do it there. 
       
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      
      },
    
      function (error) {
        console.log('An error happened');
    
      }
    );

 
    /////

    }    


}

