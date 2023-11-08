import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from "gsap";
import './style.css';

//window size

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//scene

const scene = new THREE.Scene();


// Adding directional light to the scene
const light = new THREE.SpotLight(0xffffff, 10, 40); // white light with full intensity
// const light = new THREE.PointLight(0xffffff, 10, 40); // white light with full intensity
light.position.set(10, 10, 20); // Position of the light
light.intensity = 1000;
const lightHelper = new THREE.SpotLightHelper(light);
scene.add(lightHelper);
scene.add(light);


// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .01, 1000);
camera.position.z = 3;
scene.add(camera);

const geometry = new THREE.SphereGeometry(1, 32, 16);

let textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg"; 
let displacementURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg"; 
let worldURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/hipp8_s.jpg"

let textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load( textureURL );
let displacementMap = textureLoader.load( displacementURL );


let material = new THREE.MeshPhongMaterial ( 
  { color: 0xffffff ,
  map: texture ,
     displacementMap: displacementMap,
  displacementScale: 0.06,
  bumpMap: displacementMap,
  bumpScale: 0.04,
   reflectivity:0, 
   shininess :0
  } 

);

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);




//renderer
const canvas = document.querySelector("#app")
const renderer = new THREE.WebGLRenderer({ canvas });
// canvas.appendChild(renderer.domElement);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(3)
renderer.render(scene, camera);



// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

window.addEventListener("resize", () => {

  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update the camera view
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
})


const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}
loop();



// Pop-out 

// const t1  = gsap.timeline({defaults:{duration:1}})
const t1 = gsap.timeline({ defaults: { duration: 1 } });

t1.fromTo(sphere.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
t1.fromTo("nav", { y: "-100%" }, { y: "0%" });



// Mouse Animation Color

let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]



    // update the color on the mouse move
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(sphere.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    })

    console.log(newColor);

  }
})

