import React from "react";
import { Text } from "@react-three/drei";
import AllLights from "../lights/AllLights";
import CameraControls from "../camera/CameraControls";

const WelcomeBoard = () => {
  return (
    <mesh position={[0, 1.9, 3.5]} rotation={[-Math.PI / 16, 0, 0]}>
      <TextLabel
        position={[0, 0.45, 0.1]}
        fontSize={0.1}
        text="Welcome to DAIXIT :D"
      />
      <TextLabel
        position={[0, 0.05, 0.1]}
        fontSize={0.1}
        text="Currently online: 0"
      />
      <JoinButton position={[0, -0.4, 0.1]} />
      <BoardBackground />
    </mesh>
  );
};

const TextLabel = ({ position, fontSize, text }) => {
  return (
    <Text
      position={position}
      fontSize={fontSize}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

const JoinButton = ({ position }) => {
  return (
    <mesh position={position}>
      <TextLabel position={[0, 0.05, 0.1]} fontSize={0.1} text="Join" />
      <boxGeometry args={[0.5, 0.2, 0.02]} />
      <meshBasicMaterial color="white" />
    </mesh>
  );
};

const BoardBackground = () => {
  return (
    <>
      <boxGeometry args={[2, 1.25, 0.02]} />
      <meshBasicMaterial color="gray" />
    </>
  );
};

const Lobby = () => {
  return (
    <>
      <AllLights />
      <CameraControls />
      <WelcomeBoard />
    </>
  );
};

export default Lobby;
