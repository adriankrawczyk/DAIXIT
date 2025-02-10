import ambientLight from "./ambientLight";
import directionalLight from "./directionalLight";

export default function addLights(scene) {
  scene.add(ambientLight);
  scene.add(directionalLight);
}
