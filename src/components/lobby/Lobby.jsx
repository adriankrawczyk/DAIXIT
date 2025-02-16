import React from "react";
import { Text } from "@react-three/drei";
import AllLights from "../lights/AllLights";
import CameraControls from "../camera/CameraControls";

const Lobby = () => {
  return (
    <>
      <AllLights />
      <CameraControls />

      <mesh position={[0, 1.9, 3.5]} rotation={[-Math.PI / 16, 0, 0]}>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          Welcome!
        </Text>
        <boxGeometry args={[2, 1.25, 0.02]} />
        <meshBasicMaterial attachArray="material" color="gray" />
      </mesh>
    </>
  );
};

export default Lobby;
