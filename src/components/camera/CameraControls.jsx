import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import inBounds from "../../util/maths/inBounds";

const Y_OFFSET = 3;
const MIN_Y = 2.5;
const MAX_Y = 3.5;
const MIN_X = -1;
const MAX_X = 1;

const CameraControls = () => {
  useFrame(({ camera, mouse }) => {
    camera.lookAt(new Vector3(mouse.x, mouse.y, -5));
    // camera.lookAt(new Vector3(-1,
    //  2.1, -0.01) )
    console.log(camera);
  });

  return null;
};

export default CameraControls;
