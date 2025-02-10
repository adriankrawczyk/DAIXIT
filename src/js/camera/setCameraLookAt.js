import camera from "./camera";
import mousePosition from "../mouse/mousePosition";
import { Vector3 } from "three";

const Y_OFFSET = 4;

export default function setCameraLookAt() {
  camera.lookAt(new Vector3(0, Y_OFFSET - mousePosition.y, -mousePosition.x));
}
