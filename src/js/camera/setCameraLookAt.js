import camera from "./camera";
import mousePosition from "../mouse/mousePosition";
import { Vector3 } from "three";
import inBounds from "../util/math/inBounds";

const Y_OFFSET = 4;

export default function setCameraLookAt() {
  camera.lookAt(
    new Vector3(
      0,
      inBounds(Y_OFFSET - mousePosition.y, 2, 2.75),
      inBounds(-mousePosition.x, -0.7, 0.7)
    )
  );
}
