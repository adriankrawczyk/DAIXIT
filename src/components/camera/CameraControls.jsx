import { useFrame } from "@react-three/fiber";
import { Vector3, Quaternion } from "three";
import inBounds from "../../util/maths/inBounds";
import { useSetup } from "../context/SetupContext";
import { useEffect } from "react";

const Y_OFFSET = 3;
const MIN_Y = 2.5;
const MAX_Y = 3.5;
const MIN_X = -1;
const MAX_X = 1;

const CameraControls = () => {
  const { cameraLookAt, cameraLookAtMultiplier, direction, votingPhase } =
    useSetup();

  useFrame(({ camera, mouse }) => {
    const normalGameVector = new Vector3(
      (direction === "Bottom" || direction === "Top"
        ? mouse.x
        : 0 + cameraLookAt[0]) * cameraLookAtMultiplier[0],
      (mouse.y + cameraLookAt[1]) * cameraLookAtMultiplier[1],
      (direction === "Left" || direction === "Right"
        ? mouse.x
        : 0 + cameraLookAt[2]) * cameraLookAtMultiplier[2]
    );

    if (votingPhase) {
      console.log(camera.rotation);
      camera.rotation.set(
        -Math.PI / 2 + mouse.x / 10,
        mouse.y / 10,
        Math.PI / 2
      );
      camera.updateProjectionMatrix();
      console.log(camera.rotation);
    } else camera.lookAt(normalGameVector);
  });

  return null;
};

export default CameraControls;
