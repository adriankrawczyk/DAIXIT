import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default function addOrbit(camera, renderer) {
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.update();
}
