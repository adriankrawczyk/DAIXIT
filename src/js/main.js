import * as THREE from "three";
import handleResize from "./eventListeners/handleResize";
import addObjects from "./objects/addObjects";
import camera from "./camera/camera";
import orbit from "./util/orbit";
import addOrbit from "./util/orbit";

const CANVAS_COLOR = 0x000000;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(CANVAS_COLOR);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();

function animate() {
  renderer.render(scene, camera);
}

addObjects(scene);
handleResize(renderer);
renderer.setAnimationLoop(animate);
