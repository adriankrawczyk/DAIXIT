import camera from "./camera";
import mousePosition from "../mouse/mousePosition";
import { Vector3 } from "three";
import inBounds from "../util/math/inBounds";

const Y_OFFSET = 2.75;
const MIN_Y = 2;
const MAX_Y = 3.5;
const MIN_X = -0.7;
const MAX_X = 0.7;

export default function setCameraLookAt() {
  camera.lookAt(
    new Vector3(
      0,
      inBounds(Y_OFFSET - mousePosition.y, MIN_Y, MAX_Y),
      inBounds(-mousePosition.x, MIN_X, MAX_X)
    )
  );
}
