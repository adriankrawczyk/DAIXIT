import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import inBounds from "../../util/maths/inBounds";
import { useSetup } from "../context/SetupContext";

const Y_OFFSET = 3;
const MIN_Y = 2.5;
const MAX_Y = 3.5;
const MIN_X = -1;
const MAX_X = 1;

const CameraControls = () => {
  const { cameraLookAt, cameraLookAtMultiplier, direction } = useSetup();
  useFrame(({ camera, mouse }) => {
    camera.lookAt(
      new Vector3(
        (direction === "Bottom" || direction === "Top"
          ? mouse.x
          : 0 + cameraLookAt[0]) * cameraLookAtMultiplier[0],
        (mouse.y + cameraLookAt[1]) * cameraLookAtMultiplier[1],
        (direction === "Left" || direction === "Right"
          ? mouse.x
          : 0 + cameraLookAt[2]) * cameraLookAtMultiplier[2]
      )
    );
  });

  return null;
};

export default CameraControls;
