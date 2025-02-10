import * as THREE from "three";

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

export default directionalLight;
