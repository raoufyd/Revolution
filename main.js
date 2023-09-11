import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//create a scene
const scene = new THREE.Scene();
// create a camera
const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// create a render
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas: document.querySelector("#bg"),
});
// renderer.setClearColor(0x000000); // white background - replace ffffff with any hex color

// configure rendering
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(60);
renderer.render(scene, camera);

//create a sun
const sunTexture = new THREE.TextureLoader().load("images/sun.jpg");
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(13, 32, 50),
  new THREE.MeshStandardMaterial({
    map: sunTexture,
  })
);
scene.add(sun);
// setup the center (sun)
const centerPoint = new THREE.Object3D();
sun.add(centerPoint);

// create the earth

const earthTexture = new THREE.TextureLoader().load("images/earth.jpg");
const earthNormalTexture = new THREE.TextureLoader().load(
  "images/normal-earth.jpg"
);
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 50),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthNormalTexture,
  })
);
earth.position.set(-50, 10, -10);

scene.add(earth);
//
centerPoint.add(earth);
// setup pivot point earth

const pivotPoint = new THREE.Object3D();
earth.add(pivotPoint);

// create a light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
// setup the controls zoom...
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 50;
controls.maxDistance = 200;

// listners
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

// make the animation(rotation)
function animate() {
  requestAnimationFrame(animate);

  earth.rotation.x += 0.001;
  earth.rotation.y += 0.005;
  earth.rotation.z += 0.001;

  moon.rotation.x += 0.001;
  moon.rotation.y += 0.005;
  moon.rotation.z += 0.001;

  pivotPoint.rotation.y += 0.0005;
  centerPoint.rotation.y += 0.001;

  renderer.render(scene, camera);
}

// create stars
function addStars() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(150));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStars);

// setup space background

const spaceTexture = new THREE.TextureLoader().load("images/space.jpg");
scene.background = spaceTexture;

//create the moon
const moonTexture = new THREE.TextureLoader().load("images/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("images/normal-map.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 20),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);

moon.position.set(-10, 10, -10);

scene.add(moon);
// make the pivotpoint the sphere's parent.
pivotPoint.add(moon);

//for the scroll
function moveCamera() {
  // const t = document.body.getBoundingClientRect().top;
  // console.log("t : ", t);
  // moon.position.x += 0.01;
  // moon.position.y += 1;
}
document.body.onscroll = moveCamera;

// mouse zoom

animate();
