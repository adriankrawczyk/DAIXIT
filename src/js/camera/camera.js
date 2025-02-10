import * as THREE from "three";

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5.5, 6.2, 0);
camera.lookAt(new THREE.Vector3(-1, 2.1, -0.01));

export default camera;
