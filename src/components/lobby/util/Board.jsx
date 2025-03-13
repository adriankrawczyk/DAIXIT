import { useState } from "react";
import NamePage from "../pages/NamePage";
import LobbyPage from "../pages/LobbyPage";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, useGLTF } from "@react-three/drei";

// picture frame
const BoardBackground = () => {
  return (
    <mesh position={[0,0,0]} rotation={[Math.PI/2,Math.PI/2,0]}>
      <cylinderGeometry args={[0.7, 0.7, 0.1]}/>
      <meshStandardMaterial color={"#8B0095"}/>
    </mesh>
  );
};

const Board = () => {
  const [playClicked, setPlayClicked] = useState(false); // to change
  return (
    <mesh position={[0, 1.8, 3.5]} rotation={[-Math.PI / 16, 0, 0]}>
      <BoardBackground />
      {playClicked ? (
        <LobbyPage setPlayClicked={setPlayClicked} />
      ) : (
        <NamePage setPlayClicked={setPlayClicked} />
      )}
    </mesh>
  );
};
export default Board;
