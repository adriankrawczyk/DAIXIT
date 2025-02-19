import React from "react";
import AmbientLight from "./AmbientLight";
import DirectionalLight from "./DirectionalLight";
import { useCamera } from "../context/CameraContext";

const DIRECTIONAL_LIGHT_INTENSITY = 0.8;
const DIRECTIONAL_LIGHT_COLOR ="#190042";

const AMBIENT_LIGHT_INTENSITY = 1;
const AMBIENT_LIGHT_COLOR = "#ffffff";

const AllLights = () => {
  const { directionalLightPosition } = useCamera();
  return (
    <>
      <AmbientLight
        intensity={AMBIENT_LIGHT_INTENSITY}
        color={AMBIENT_LIGHT_COLOR}
      />

      <DirectionalLight
        intensity={DIRECTIONAL_LIGHT_INTENSITY}
        color={DIRECTIONAL_LIGHT_COLOR}
        position={directionalLightPosition}
      />
    </>
  );
};

export default AllLights;
