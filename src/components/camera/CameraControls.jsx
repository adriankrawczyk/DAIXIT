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
    const normalGameVector = new Vector3(0, 0, 0);

    switch (direction) {
      case "Bottom":
        normalGameVector.x = mouse.x * 1 * cameraLookAtMultiplier[0];
        normalGameVector.y =
          (mouse.y + cameraLookAt[1]) * cameraLookAtMultiplier[1];
        normalGameVector.z = 0 + cameraLookAt[2] * cameraLookAtMultiplier[2];
        break;

      case "Top":
        normalGameVector.x = mouse.x * 1 * cameraLookAtMultiplier[0];
        normalGameVector.y =
          (mouse.y + cameraLookAt[1]) * cameraLookAtMultiplier[1];
        normalGameVector.z = 0 + cameraLookAt[2] * cameraLookAtMultiplier[2];
        break;

      case "Left":
        normalGameVector.x = 0 + cameraLookAt[0] * cameraLookAtMultiplier[0];
        normalGameVector.y =
          (mouse.y + cameraLookAt[1]) * cameraLookAtMultiplier[1];
        normalGameVector.z = mouse.x * 1 * cameraLookAtMultiplier[2];
        break;

      case "Right":
        normalGameVector.x = 0 + cameraLookAt[0] * cameraLookAtMultiplier[0];
        normalGameVector.y =
          (mouse.y + cameraLookAt[1]) * cameraLookAtMultiplier[1];
        normalGameVector.z = mouse.x * 1 * cameraLookAtMultiplier[2];
        break;

      case "LeftBottom":
        normalGameVector.x = mouse.x * 0.7 * cameraLookAtMultiplier[0];
        normalGameVector.y =
          (mouse.y + cameraLookAt[1]) * cameraLookAtMultiplier[1];
        normalGameVector.z = mouse.x * 0.7 * cameraLookAtMultiplier[2];
        break;

      case "LeftTop":
        normalGameVector.x = mouse.x * 0.7 * cameraLookAtMultiplier[0];
        normalGameVector.y =
          (mouse.y + cameraLookAt[1]) * cameraLookAtMultiplier[1];
        normalGameVector.z = mouse.x * -1.4 * cameraLookAtMultiplier[2];
        break;

      case "RightBottom":
        normalGameVector.x = mouse.x * -0.7 * cameraLookAtMultiplier[0];
        normalGameVector.y =
          (mouse.y + cameraLookAt[1]) * cameraLookAtMultiplier[1];
        normalGameVector.z = mouse.x * 1.4 * cameraLookAtMultiplier[2];
        break;

      case "RightTop":
        normalGameVector.x = mouse.x * -0.7 * cameraLookAtMultiplier[0];
        normalGameVector.y =
          (mouse.y + cameraLookAt[1]) * cameraLookAtMultiplier[1];
        normalGameVector.z = mouse.x * -0.7 * cameraLookAtMultiplier[2];
        break;

      default:
        break;
    }

    if (votingPhase) {
      camera.rotation.set(
        -Math.PI / 2 + mouse.x / 10,
        mouse.y / 10,
        Math.PI / 2
      );
      camera.updateProjectionMatrix();
    } else camera.lookAt(normalGameVector);
  });

  return null;
};

export default CameraControls;
